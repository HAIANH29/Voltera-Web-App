import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import refundService from "../../services/refundService";
import "./TransactionPage.css";

const TransactionPage = () => {
  const navigate = useNavigate();

  // States
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Refund states
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTransaction, setRefundTransaction] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundImages, setRefundImages] = useState([]);

  const ITEMS_PER_PAGE = 10;

  // Initialize current user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
  }, []);

  // Fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      // Luôn dùng endpoint filter theo status
      const endpoint = `/api/transactions/${filter}`;

      const response = await api.get(endpoint);
      console.log("Fetched transactions:", response.data); // Debug log
      setTransactions(response.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Unable to load transaction list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const stats = {
    total: transactions.length,
    pending: transactions.filter((t) => t.transactionStatus === "PENDING")
      .length,
    completed: transactions.filter((t) => t.transactionStatus === "DONE")
      .length,
    failed: transactions.filter((t) => t.transactionStatus === "FAILED").length,
    totalAmount: transactions
      .filter((t) => t.transactionStatus === "DONE")
      .reduce((sum, t) => sum + (t.price || 0), 0),
  };

  // Filter and search transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      if (searchTerm) {
        return (
          transaction.postTitle
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.id?.toString().includes(searchTerm) ||
          transaction.transactionStatus
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Helper functions
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: "Pending", class: "status-pending" },
      DONE: { label: "Done", class: "status-completed" },
      FAILED: { label: "Failed", class: "status-failed" },
      CANCELLED: { label: "Cancelled", class: "status-cancelled" },
    };

    const config = statusConfig[status] || {
      label: status,
      class: "status-unknown",
    };
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetails = async (transaction) => {
    try {
      // Fetch full transaction details from API
      const response = await api.get(
        `/api/transactions/detail/${transaction.id}`
      );
      setSelectedTransaction(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching transaction details:", err);
      // Fallback to showing the transaction data we have
      setSelectedTransaction(transaction);
      setShowModal(true);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRequestRefund = (transaction) => {
    setRefundTransaction(transaction);
    setShowRefundModal(true);
    setRefundReason("");
    setRefundImages([]);
  };

  const handleSubmitRefund = async () => {
    if (!refundReason.trim()) {
      alert("Please provide a reason for the refund");
      return;
    }

    try {
      const transactionId =
        refundTransaction.id ||
        refundTransaction.transactionId ||
        refundTransaction.transactionid;

      console.log("🔍 Refund Debug Info:", {
        refundTransaction,
        transactionId,
        refundReason,
        imagesCount: refundImages.length,
      });

      // Create refund request
      const refund = await refundService.createRefund(
        transactionId,
        refundReason
      );

      // If images are selected, upload them
      if (refundImages.length > 0) {
        await refundService.uploadRefundImages(refund.id, refundImages);
      }

      alert("Refund request submitted successfully!");
      setShowRefundModal(false);
      setRefundTransaction(null);
      setRefundReason("");
      setRefundImages([]);

      // Optionally navigate to refunds page
      navigate("/refunds");
    } catch (error) {
      console.error("Error submitting refund request:", error);

      let errorMessage = "Failed to submit refund request.";

      if (error.response?.data?.message) {
        // Backend returned a specific error message
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        // Backend returned error in "error" field
        errorMessage = error.response.data.error;
      } else if (typeof error.response?.data === "string") {
        // Backend returned error data as string
        errorMessage = error.response.data;
      } else if (error.message) {
        // Generic error message
        errorMessage = error.message;
      }

      console.log("📋 Error details:", {
        errorResponse: error.response?.data,
        errorMessage: errorMessage,
      });

      alert(errorMessage);
    }
  };

  const TransactionModal = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Transaction Details</h2>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="transaction-detail-grid">
              <div className="detail-item">
                <label>Transaction ID:</label>
                <span>#{selectedTransaction.id}</span>
              </div>

              <div className="detail-item">
                <label>Product:</label>
                <span>{selectedTransaction.postTitle}</span>
              </div>

              <div className="detail-item">
                <label>Amount:</label>
                <span className="amount">
                  {formatCurrency(selectedTransaction.price)}
                </span>
              </div>

              <div className="detail-item">
                <label>Status:</label>
                {getStatusBadge(selectedTransaction.transactionStatus)}
              </div>

              <div className="detail-item">
                <label>Created Date:</label>
                <span>{formatDate(selectedTransaction.createAt)}</span>
              </div>

              {selectedTransaction.updateAt && (
                <div className="detail-item">
                  <label>Last Updated:</label>
                  <span>{formatDate(selectedTransaction.updateAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            {selectedTransaction.transactionStatus === "PENDING" && (
              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    setShowModal(false);
                    console.log(
                      "Selected transaction object:",
                      selectedTransaction
                    ); // Debug log

                    // Try different possible ID fields
                    const transactionId =
                      selectedTransaction.id ||
                      selectedTransaction.transactionId ||
                      selectedTransaction.transactionid;
                    console.log("Using transaction ID:", transactionId);

                    if (!transactionId) {
                      console.error("No transaction ID found!");
                      alert(
                        "Transaction ID not found. Cannot proceed with payment."
                      );
                      return;
                    }

                    // Navigate to payment page first
                    const postId =
                      selectedTransaction.post?.id ||
                      selectedTransaction.postId ||
                      "";
                    const amount = selectedTransaction.price || "";
                    const orderInfo = `Fee payment for: ${
                      selectedTransaction.postTitle || "Post"
                    }`;

                    navigate(
                      `/payment?paymentType=fee&transactionId=${transactionId}&postId=${postId}&amount=${amount}&orderInfo=${encodeURIComponent(
                        orderInfo
                      )}`
                    );
                  } catch (error) {
                    console.error("Error creating payment:", error);
                    // Fallback to payment page with all necessary info
                    const transactionId =
                      selectedTransaction.id ||
                      selectedTransaction.transactionId ||
                      selectedTransaction.transactionid;
                    const postId =
                      selectedTransaction.post?.id ||
                      selectedTransaction.postId ||
                      "";
                    const amount = selectedTransaction.price || "";
                    const orderInfo = `Fee payment for: ${
                      selectedTransaction.postTitle || "Post"
                    }`;

                    navigate(
                      `/payment?paymentType=fee&transactionId=${transactionId}&postId=${postId}&amount=${amount}&orderInfo=${encodeURIComponent(
                        orderInfo
                      )}`
                    );
                  }
                }}
              >
                💳 Pay Fee
              </button>
            )}
            {selectedTransaction.transactionStatus === "DONE" &&
              currentUser?.role !== "SELLER" && (
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    setShowModal(false);
                    setRefundTransaction(selectedTransaction);
                    setShowRefundModal(true);
                  }}
                >
                  🔄 Request Refund
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="transaction-page">
      <div className="transaction-header">
        <h1>Transaction History</h1>
        <p>Manage and track your transactions</p>
      </div>

      {/* Transaction Stats */}
      {!loading && !error && transactions.length > 0 && (
        <div className="transaction-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Transactions</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Done</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{stats.failed}</h3>
              <p>Failed</p>
            </div>
          </div>

          <div className="stat-card total-amount">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalAmount)}</h3>
              <p>Total Value</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="transaction-controls">
        <div className="filter-section">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="PENDING">Pending</option>
              <option value="DONE">Done</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="createAt">Created Date</option>
              <option value="price">Amount</option>
              <option value="transactionStatus">Status</option>
            </select>
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by product name, transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button className="btn btn-primary" onClick={fetchTransactions}>
              Thử lại
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No transactions yet</h3>
            <p>You haven't made any transactions yet. Start shopping!</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/vehicles")}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <>
            <div className="transaction-table-container">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="transaction-row">
                      <td className="transaction-id">#{transaction.id}</td>
                      <td className="transaction-product">
                        <div className="product-info">
                          <span className="product-title">
                            {transaction.postTitle}
                          </span>
                        </div>
                      </td>
                      <td className="transaction-amount">
                        {formatCurrency(transaction.price)}
                      </td>
                      <td className="transaction-status">
                        {getStatusBadge(transaction.transactionStatus)}
                      </td>
                      <td className="transaction-date">
                        {formatDate(transaction.createAt)}
                      </td>
                      <td className="transaction-actions">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleViewDetails(transaction)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        {transaction.transactionStatus === "PENDING" && (
                          <button
                            className="btn-action btn-pay"
                            onClick={async () => {
                              try {
                                console.log("Transaction object:", transaction); // Debug log

                                // Try different possible ID fields
                                const transactionId =
                                  transaction.id ||
                                  transaction.transactionId ||
                                  transaction.transactionid;
                                console.log(
                                  "Using transaction ID:",
                                  transactionId
                                );

                                if (!transactionId) {
                                  console.error("No transaction ID found!");
                                  setError(
                                    "Transaction ID not found. Cannot proceed with payment."
                                  );
                                  return;
                                }

                                // Navigate to payment page first
                                const postId =
                                  transaction.post?.id ||
                                  transaction.postId ||
                                  "";
                                const amount = transaction.price || "";
                                const orderInfo = `Fee payment for: ${
                                  transaction.postTitle || "Post"
                                }`;

                                navigate(
                                  `/payment?paymentType=fee&transactionId=${transactionId}&postId=${postId}&amount=${amount}&orderInfo=${encodeURIComponent(
                                    orderInfo
                                  )}`
                                );
                              } catch (error) {
                                console.error("Error creating payment:", error);
                                // Fallback to payment page with all necessary info
                                const transactionId =
                                  transaction.id ||
                                  transaction.transactionId ||
                                  transaction.transactionid;
                                const postId =
                                  transaction.post?.id ||
                                  transaction.postId ||
                                  "";
                                const amount = transaction.price || "";
                                const orderInfo = `Fee payment for: ${
                                  transaction.postTitle || "Post"
                                }`;

                                navigate(
                                  `/payment?paymentType=fee&transactionId=${transactionId}&postId=${postId}&amount=${amount}&orderInfo=${encodeURIComponent(
                                    orderInfo
                                  )}`
                                );
                              }
                            }}
                            title="Pay Fee"
                          >
                            💳
                          </button>
                        )}
                        {transaction.transactionStatus === "DONE" &&
                          currentUser?.role !== "SELLER" && (
                            <button
                              className="btn-action btn-refund"
                              onClick={() => handleRequestRefund(transaction)}
                              title="Request Refund"
                            >
                              🔄
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹ Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && <TransactionModal />}

      {/* Refund Modal */}
      {showRefundModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRefundModal(false)}
        >
          <div
            className="modal-content refund-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Request Refund</h2>
              <button
                className="modal-close"
                onClick={() => setShowRefundModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {refundTransaction && (
                <div className="refund-form">
                  <div className="transaction-summary">
                    <h3>Transaction Details</h3>
                    <p>
                      <strong>ID:</strong> #{refundTransaction.id}
                    </p>
                    <p>
                      <strong>Product:</strong> {refundTransaction.postTitle}
                    </p>
                    <p>
                      <strong>Amount:</strong>{" "}
                      {formatCurrency(refundTransaction.price)}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {formatDate(refundTransaction.createAt)}
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="refund-reason">Reason for Refund *</label>
                    <textarea
                      id="refund-reason"
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Please explain why you are requesting a refund..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="refund-images">
                      Supporting Images (Optional)
                    </label>
                    <input
                      type="file"
                      id="refund-images"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        setRefundImages(Array.from(e.target.files))
                      }
                    />
                    <p className="form-help">
                      Upload photos to support your refund request (product
                      damage, etc.)
                    </p>
                    {refundImages.length > 0 && (
                      <p className="selected-files">
                        {refundImages.length} file(s) selected
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRefundModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitRefund}
                disabled={!refundReason.trim()}
              >
                Submit Refund Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
