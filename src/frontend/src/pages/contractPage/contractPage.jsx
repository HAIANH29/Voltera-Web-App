import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../config/api";
import { navigateToPayment } from "../../utils/paymentUtils";
import "./contractPage.css";

// Icon SVGs (tương tự dashboardAdmin)
const ContractIcon = () => (
  <svg
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="2" />
    <path d="M8 8h8M8 12h8M8 16h4" strokeWidth="2" />
  </svg>
);

export default function ContractPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    postId: ""
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      if (!token) {
        console.warn("⚠️ No authentication token found");
        setError("Please login to manage contracts");
        return;
      }
      
      console.log("✅ User authenticated");
      setUserInfo({ hasToken: true });
    };
    
    checkAuth();
  }, []);

  // Fetch contract list with proper error handling
  const fetchContracts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await api.get("/api/contract/list");
      
      if (res.data && Array.isArray(res.data)) {
        // Enhanced data processing with UX improvements
        const validContracts = res.data
          .filter(contract => contract?.contractId && contract?.postTitle)
          .map(contract => ({
            ...contract,
            // Add computed fields for better dual-signature UX
            statusDisplay: getStatusDisplayText(contract.contractStatus),
            canSign: ["PENDING", "BUYER_SIGNED", "SELLER_SIGNED"].includes(contract.contractStatus),
            canCancel: ["PENDING", "BUYER_SIGNED", "SELLER_SIGNED"].includes(contract.contractStatus),
            canPayment: contract.contractStatus === "SIGNED", // Both parties signed
            buyerName: contract.buyerName || "Unknown Buyer", 
            sellerName: contract.sellerName || "Unknown Seller",
            totalAmount: contract.totalAmount || 0,
            // Determine user role and signing status
            needsBuyerSign: contract.contractStatus === "PENDING" || contract.contractStatus === "SELLER_SIGNED",
            needsSellerSign: contract.contractStatus === "PENDING" || contract.contractStatus === "BUYER_SIGNED"
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
        
        setContracts(validContracts);
        console.log(`✅ Loaded ${validContracts.length} contracts`);
      } else {
        throw new Error("Invalid data format received from server");
      }
    } catch (err) {
      const errorMsg = err.response?.status === 401 
        ? "Session expired. Please login again."
        : err.response?.status === 403
        ? "You don't have permission to view contracts."
        : err.response?.status === 500
        ? "Server error. Please try again later."
        : `Failed to load contracts: ${err.response?.data?.message || err.message}`;
      
      setError(errorMsg);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for enhanced status display
  const getStatusDisplayText = (status) => {
    const statusMap = {
      'PENDING': '⏳ Awaiting Signatures',
      'BUYER_SIGNED': '👤 Buyer Signed - Awaiting Seller',
      'SELLER_SIGNED': '🏪 Seller Signed - Awaiting Buyer', 
      'SIGNED': '✅ Fully Signed - Ready for Payment',
      'COMPLETED': '🎉 Contract Completed',
      'CANCELLED': '❌ Contract Cancelled'
    };
    return statusMap[status] || status;
  };

  // Fetch transactions with error handling
  const fetchTransactions = async () => {
    try {
      const res = await api.get("/api/contract/transactions");
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // Silent fail for transactions - not critical for contract display
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchTransactions();
    
    // Check if coming from vehicle detail page
    const postId = searchParams.get("postId");
    const action = searchParams.get("action");
    
    if (postId && action === "create") {
      setForm({ postId });
      setShowCreate(true);
    }
  }, [searchParams]);

  // Check if user is logged in
  const checkAuth = () => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    const token = getCookie("accessToken");
    if (!token) {
      setError("You must be logged in to create contracts. Please login first.");
      return false;
    }
    return true;
  };

  // Create new contract
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!checkAuth()) {
      return;
    }

    setActionLoading(true);
    setError("");
    
    try {
      console.log("📝 Creating contract:", form);
      
      // Validate form data
      if (!form.postId) {
        setError("Please enter Post ID");
        setActionLoading(false);
        return;
      }

      const contractData = {
        postId: parseInt(form.postId)
      };

      console.log("📝 Sending contract data:", contractData);
      
      const response = await api.post("/api/contract/create", contractData);
      console.log("✅ Contract created successfully:", response.data);
      
      setShowCreate(false);
      setForm({ postId: "" });
      fetchContracts();
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("❌ Error creating contract:", err);
      console.error("❌ Error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (err.response?.status === 400) {
        setError(`Invalid data: ${err.response?.data?.message || 'Please check your input'}`);
      } else if (err.response?.status === 404) {
        setError("Post not found. Please check the Post ID.");
      } else {
        setError(`Failed to create contract: ${err.response?.data?.message || err.message}`);
      }
    }
    setActionLoading(false);
  };

  // Sign contract with comprehensive error handling
  const handleSign = async (contract) => {
    if (!contract?.contractId) {
      setError("Invalid contract data");
      return;
    }

    console.log("🖊️ Attempting to sign contract:", contract.contractId);
    console.log("📋 Contract status:", contract.contractStatus);

    setActionLoading(true);
    setError("");
    
    try {
      const response = await api.put(`/api/contract/${contract.contractId}/sign`);
      console.log("✅ Contract signed successfully:", response.data);
      
      // Show success feedback
      setError(""); // Clear any previous errors
      
      // Refresh data
      await Promise.all([fetchContracts(), fetchTransactions()]);
      
    } catch (err) {
      const errorMsg = err.response?.status === 409 
        ? "Contract has already been signed or cancelled"
        : err.response?.status === 404
        ? "Contract not found"
        : err.response?.status === 403
        ? "You don't have permission to sign this contract"
        : `Failed to sign contract: ${err.response?.data?.message || err.message}`;
      
      setError(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel contract with confirmation
  const handleCancel = async (contract) => {
    if (!contract?.contractId) {
      setError("Invalid contract data");
      return;
    }

    // User confirmation for destructive action
    if (!window.confirm(`Are you sure you want to cancel contract #${contract.contractId}?`)) {
      return;
    }

    setActionLoading(true);
    setError("");
    
    try {
      await api.put(`/api/contract/${contract.contractId}/cancel`);
      await fetchContracts(); // Refresh contracts
      setError(""); // Clear any previous errors
      
    } catch (err) {
      const errorMsg = err.response?.status === 409 
        ? "Contract cannot be cancelled in its current state"
        : err.response?.status === 404
        ? "Contract not found"
        : err.response?.status === 403
        ? "You don't have permission to cancel this contract"
        : `Failed to cancel contract: ${err.response?.data?.message || err.message}`;
      
      setError(errorMsg);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle payment - navigate to payment page
  const handlePayment = (contract) => {
    console.log("💳 Initiating payment for contract:", contract);
    
    // Find if there's already a successful transaction for this contract
    const existingTransaction = transactions.find(t => 
      t.postId === contract.postId && t.status === "DONE"
    );
    
    if (existingTransaction) {
      setError("This contract has already been paid for!");
      return;
    }
    
    navigateToPayment(navigate, {
      postId: contract.postId,
      amount: contract.price,
      contractId: contract.contractId,
      orderInfo: `Payment for contract #${contract.contractId} - ${contract.postTitle || 'Vehicle purchase'}`
    });
  };

  return (
    <div className="contract-inner">
      <div className="contract-header">
        <ContractIcon />
        <h2>Contract Management</h2>
        <button className="btn" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Close" : "Create New Contract"}
        </button>
      </div>

      {/* Debug Panel - Test Mode */}
      <div className="debug-panel card">
        <h3>🧪 Debug Info & Test Mode</h3>
        <div className="debug-grid">
          <div><strong>Auth:</strong> {userInfo?.hasToken ? '✅ OK' : '❌ No Token'}</div>
          <div><strong>Contracts:</strong> {contracts.length} loaded</div>
          <div><strong>Loading:</strong> {actionLoading ? '⏳ Yes' : '✅ No'}</div>
          <div><strong>VNPay:</strong> Sandbox mode active</div>
        </div>
        {error && <div className="debug-error">🚨 <strong>Error:</strong> {error}</div>}
      </div>

      {error && <div className="error-msg">{error}</div>}
      {showCreate && (
        <form className="contract-form card" onSubmit={handleCreate}>
          <h3>Create New Contract</h3>
          <div className="contract-info">
            <p>ℹ️ <strong>How it works:</strong></p>
            <ul>
              <li>You (buyer) create a contract for a specific post</li>
              <li>The post owner (seller) will be automatically added</li>
              <li>Price and details are taken from the post</li>
              <li>Both parties need to sign before payment</li>
            </ul>
          </div>
          <div className="form-row">
            <label>Post ID:</label>
            <input
              required
              type="number"
              value={form.postId}
              onChange={(e) => setForm({ postId: e.target.value })}
              placeholder="Enter post ID (e.g. 123)"
            />
          </div>
          <button className="btn" type="submit" disabled={actionLoading}>
            {actionLoading ? "Creating..." : "Create Contract"}
          </button>
        </form>
      )}
      <div className="card contract-list">
        <h3>Your Contracts</h3>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <div className="loading-text">Loading...</div>
          </div>
        ) : contracts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <div className="empty-title">No contracts found</div>
            <div className="empty-text">
              You have not created or received any purchase contracts.
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Contract #</th>
                <th>📄 Vehicle</th>
                <th>👤 Buyer</th>
                <th>🏪 Seller</th>
                <th>💰 Amount</th>
                <th>📝 Signature Status</th>
                <th>💳 Payment</th>
                <th>🎯 Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => {
                // Check if payment exists for this contract
                const hasPayment = transactions.some(t => 
                  t.postId === contract.postId && t.status === "DONE"
                );
                
                return (
                  <tr key={contract.contractId || index}>
                    <td>#{contract.contractId}</td>
                    <td>{contract.postTitle || `Post #${contract.postId || 'N/A'}`}</td>
                    <td>{contract.buyerName || 'N/A'}</td>
                    <td>{contract.sellerName || 'N/A'}</td>
                    <td className="price-cell">
                      {contract.price ? new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(contract.price) : 'N/A'}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          contract.contractStatus === "SIGNED"
                            ? "success"
                            : contract.contractStatus === "CANCELLED"
                            ? "danger"
                            : contract.contractStatus === "PENDING"
                            ? "warning"
                            : "secondary"
                        }`}
                      >
                        {contract.statusDisplay || contract.contractStatus || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          hasPayment ? "success" : "secondary"
                        }`}
                      >
                        {hasPayment ? "✅ Paid" : "❌ Unpaid"}
                      </span>
                    </td>
                    <td className="action-buttons">
                      {/* Dual Signature Flow */}
                      {contract.canSign && (
                        <div className="signature-actions">
                          <button
                            className="btn sign-btn"
                            disabled={actionLoading}
                            onClick={() => handleSign(contract)}
                            title={`Sign as ${contract.needsBuyerSign && contract.needsSellerSign ? 'Buyer/Seller' : contract.needsBuyerSign ? 'Buyer' : 'Seller'}`}
                          >
                            ✍️ Sign Contract
                          </button>
                          <button
                            className="btn danger cancel-btn"
                            disabled={actionLoading}
                            onClick={() => handleCancel(contract)}
                            title="Cancel this contract"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      )}
                      
                      {/* Payment Button - Only when BOTH signed */}
                      {contract.canPayment && !hasPayment && (
                        <button
                          className="btn payment-btn premium"
                          disabled={actionLoading}
                          onClick={() => handlePayment(contract)}
                          title="Both parties signed - Proceed to payment"
                        >
                          💳 Pay Now
                        </button>
                      )}
                      
                      {/* Completed State */}
                      {hasPayment && (
                        <div className="completed-badge">
                          <span className="completed-icon">🎉</span>
                          <span>Contract Completed</span>
                        </div>
                      )}
                      
                      {/* Debug info for incomplete states */}
                      {!contract.contractStatus && (
                        <span className="debug-info">⚠️ No Status</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Transactions History */}
      <div className="card transactions-section">
        <h3>Payment History</h3>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <div className="empty-title">No payments found</div>
            <div className="empty-text">
              Payments will appear here after successful contract transactions.
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Post ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={transaction.id || index}>
                  <td>#{transaction.id}</td>
                  <td>Post #{transaction.postId}</td>
                  <td className="price-cell">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(transaction.amount || transaction.price || 0)}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        transaction.status === "DONE" || transaction.transactionStatus === "DONE"
                          ? "success"
                          : transaction.status === "FAILED" || transaction.transactionStatus === "FAILED"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {transaction.status || transaction.transactionStatus}
                    </span>
                  </td>
                  <td>
                    {transaction.createAt 
                      ? new Date(transaction.createAt).toLocaleString('vi-VN')
                      : transaction.paymentDate
                      ? new Date(transaction.paymentDate).toLocaleString('vi-VN')
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <span className="payment-method">
                      {transaction.paymentMethod || 'VNPAY'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Loading overlay for better UX */}
      {(loading || actionLoading) && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{loading ? "Loading contracts..." : "Processing..."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
