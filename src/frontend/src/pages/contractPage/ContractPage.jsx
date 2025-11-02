import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../config/api";
import ContractPreview from "../../components/contract/contractPreview";
import ContractInfoPreview from "../../components/contractInfoPreview/ContractInfoPreview";
import "./ContractPage.css";

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
  const [searchParams] = useSearchParams();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    vehicleId: "",
    buyerId: "",
    sellerId: "",
    price: "",
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Contract viewing/creation states
  const postId = searchParams.get("postId");
  const action = searchParams.get("action");
  const contractId = searchParams.get("contractId");
  const [viewingContract, setViewingContract] = useState(null);
  const [showContractPreview, setShowContractPreview] = useState(false);

  // Fetch contract list
  const fetchContracts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/contract/list");
      setContracts(res.data);
      console.log("✅ Contracts loaded:", res.data);
    } catch (err) {
      console.error("❌ Error loading contracts:", err);
      setError(err.response?.data?.message || "Failed to load contracts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  useEffect(() => {
    // Nếu có contractId trong URL, hiển thị contract detail
    if (contractId) {
      setViewingContract(contractId);
    }
    // Nếu có postId và action=create, hiển thị contract creation
    if (postId && action === "create") {
      setShowContractPreview(true);
    }
  }, [contractId, postId, action]);

  // Create new contract (for manual form - deprecated, use ContractInfoPreview instead)
  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    try {
      // Backend expects { postId: Integer }
      await api.post("/api/contract/create", {
        postId: parseInt(form.vehicleId),
      });
      setShowCreate(false);
      setForm({ vehicleId: "", buyerId: "", sellerId: "", price: "" });
      fetchContracts();
    } catch (err) {
      console.error("❌ Error creating contract:", err);
      setError(err.response?.data?.message || "Failed to create contract");
    }
    setActionLoading(false);
  };

  // Sign contract
  const handleSign = async (id) => {
    setActionLoading(true);
    setError("");
    try {
      await api.put(`/api/contract/${id}/sign`);
      fetchContracts();
    } catch (err) {
      console.error("❌ Error signing contract:", err);
      setError(err.response?.data?.message || "Failed to sign contract");
    }
    setActionLoading(false);
  };

  // Cancel contract
  const handleCancel = async (id) => {
    setActionLoading(true);
    setError("");
    try {
      await api.put(`/api/contract/${id}/cancel`);
      fetchContracts();
    } catch (err) {
      console.error("❌ Error cancelling contract:", err);
      setError(err.response?.data?.message || "Failed to cancel contract");
    }
    setActionLoading(false);
  };

  // Handle viewing contract detail
  const handleViewContract = (contractId) => {
    setViewingContract(contractId);
  };

  // Handle contract created from preview modal
  const handleContractCreated = (newContractData) => {
    console.log("✅ Contract created:", newContractData);
    setShowContractPreview(false);
    fetchContracts();
    alert(
      `🎉 Contract #${newContractData.contractId} has been created and signed successfully!`
    );
  };

  return (
    <div className="contract-inner">
      <div className="contract-header">
        <ContractIcon />
        <h2>Contract Management</h2>
        {!postId && !viewingContract && (
          <button className="btn" onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? "Close" : "Create New Contract"}
          </button>
        )}
        {postId && (
          <button className="btn" onClick={() => setShowContractPreview(true)}>
            📋 Create Contract for Post #{postId}
          </button>
        )}
        {viewingContract && (
          <button className="btn" onClick={() => setViewingContract(null)}>
            ⬅️ Back to Contract List
          </button>
        )}
        <button
          className="btn"
          onClick={fetchContracts}
          disabled={loading}
          style={{ marginLeft: "8px", backgroundColor: "#6b7280" }}
        >
          🔄 {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
      {error && <div className="error-msg">{error}</div>}
      {!viewingContract && showCreate && (
        <form className="contract-form card" onSubmit={handleCreate}>
          <h3>Create New Contract (Manual)</h3>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Note: Use "Tạo hợp đồng" from vehicle detail page for better
            experience
          </p>
          <div className="form-row">
            <label>Post ID:</label>
            <input
              required
              type="number"
              placeholder="Enter Post ID"
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            />
          </div>
          <button className="btn" type="submit" disabled={actionLoading}>
            Create Contract
          </button>
        </form>
      )}
      {!viewingContract && (
        <div className="card contract-list">
          <h3>Your Contracts ({contracts.length})</h3>
          {error && (
            <div
              style={{
                color: "red",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
              }}
            >
              ❌ {error}
            </div>
          )}
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
                  <th>ID</th>
                  <th>Post Title</th>
                  <th>Buyer</th>
                  <th>Seller</th>
                  <th>Status</th>
                  <th>Signed Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.contractId}>
                    <td>#{contract.contractId}</td>
                    <td>{contract.postTitle || "N/A"}</td>
                    <td>{contract.buyerName || "N/A"}</td>
                    <td>{contract.sellerName || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${
                          contract.contractStatus === "SIGNED"
                            ? "success"
                            : contract.contractStatus === "CANCELLED" ||
                              contract.contractStatus === "CANCEL"
                            ? "danger"
                            : "secondary"
                        }`}
                      >
                        {contract.contractStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      <div>Buyer: {contract.signedByBuyer ? "✅" : "❌"}</div>
                      <div>Seller: {contract.signedBySeller ? "✅" : "❌"}</div>
                    </td>
                    <td className="action-buttons">
                      {contract.contractStatus === "PENDING" && (
                        <>
                          <button
                            className="btn"
                            disabled={actionLoading}
                            onClick={() => handleSign(contract.contractId)}
                          >
                            Sign
                          </button>
                          <button
                            className="btn danger"
                            disabled={actionLoading}
                            onClick={() => handleCancel(contract.contractId)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        className="btn"
                        onClick={() => handleViewContract(contract.contractId)}
                        style={{ marginTop: "4px", fontSize: "12px" }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Contract Detail View */}
      {viewingContract && (
        <ContractPreview
          contractId={viewingContract}
          onClose={() => setViewingContract(null)}
        />
      )}

      {/* Contract Info Preview Modal (for creating new contracts) */}
      {postId && (
        <ContractInfoPreview
          postId={postId}
          show={showContractPreview}
          onCreateContract={handleContractCreated}
          onCancel={() => setShowContractPreview(false)}
        />
      )}
    </div>
  );
}
