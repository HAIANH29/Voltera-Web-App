import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import refundService, { REFUND_STATUS } from "../../services/refundService";
import "./RefundPage.css";

const RefundPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("buyer");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [userRole, setUserRole] = useState("BUYER");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [uploadImages, setUploadImages] = useState([]);
  const [previousRefunds, setPreviousRefunds] = useState([]);
  const [notification, setNotification] = useState("");
  const [claimedRefunds, setClaimedRefunds] = useState(new Set());

  const navigate = useNavigate();

  // Initialize user role only once
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const role = user.role || localStorage.getItem("userRole") || "BUYER";
    console.log("🔍 User role detected:", role, "from user:", user);
    setUserRole(role);

    // Set default tab based on role - only set initially
    if (role === "SELLER") {
      setActiveTab("seller");
    } else {
      setActiveTab("buyer");
    }
  }, []); // Empty dependency array - only run once

  // Load refunds when tab or filter changes
  useEffect(() => {
    if (userRole) {
      // Only load when userRole is set
      loadRefunds();
    }
  }, [statusFilter, activeTab, userRole]);

  // Auto-refresh disabled - users can manually refresh if needed
  // useEffect(() => {
  //   if (userRole) {
  //     const interval = setInterval(() => {
  //       loadRefunds();
  //     }, 10000); // Refresh every 10 seconds

  //     return () => clearInterval(interval);
  //   }
  // }, [statusFilter, activeTab, userRole]);

  const loadRefunds = async () => {
    setLoading(true);
    setError("");
    try {
      console.log(
        `Loading refunds for tab: ${activeTab}, status: ${statusFilter}, userRole: ${userRole}`
      );

      let data;
      if (activeTab === "buyer") {
        data = await refundService.getBuyerRefunds(statusFilter);
      } else if (activeTab === "seller") {
        data = await refundService.getSellerRefunds(statusFilter);
      } else {
        data = [];
      }

      console.log("Raw API response data:", data);

      const newRefunds = Array.isArray(data) ? data : [];

      // Check claim status for approved refunds if user is buyer
      if (activeTab === "buyer") {
        for (const refund of newRefunds) {
          if (refund.refundStatus === "APPROVED") {
            await checkRefundClaimStatus(refund.id);
          }
        }
      }

      // Detect status changes for notifications (only for buyer)
      if (activeTab === "buyer" && previousRefunds.length > 0) {
        newRefunds.forEach((newRefund) => {
          const prevRefund = previousRefunds.find(
            (prev) => prev.id === newRefund.id
          );
          if (
            prevRefund &&
            prevRefund.refundStatus !== newRefund.refundStatus
          ) {
            setNotification(
              `Refund #${newRefund.id} status updated to ${newRefund.refundStatus}`
            );
            setTimeout(() => setNotification(""), 5000); // Clear after 5 seconds
          }
        });
      }

      setPreviousRefunds(newRefunds);
      setRefunds(newRefunds);
      console.log(`Loaded ${newRefunds.length || 0} refunds`);
    } catch (err) {
      console.error("Error loading refunds:", err);
      console.error("Error details:", err.response?.data || err.message);
      setError("Failed to load refunds. Please try again.");
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRefund = async (refundId) => {
    try {
      await refundService.acceptRefund(refundId);
      loadRefunds(); // Reload data
      alert("Refund accepted successfully");
    } catch (err) {
      console.error("Error accepting refund:", err);
      alert("Failed to accept refund: " + (err.response?.data || err.message));
    }
  };

  const handleRejectRefund = async (refundId) => {
    try {
      await refundService.rejectRefund(refundId);
      loadRefunds(); // Reload data
      alert("Refund rejected successfully");
    } catch (err) {
      console.error("Error rejecting refund:", err);
      alert("Failed to reject refund: " + (err.response?.data || err.message));
    }
  };

  const handleClaimMoney = async (refundId) => {
    try {
      const response = await refundService.claimRefundMoney(refundId);

      // Backend now returns success message instead of URL
      if (response && typeof response === "string") {
        alert(`✅ ${response}`);
      } else {
        alert(
          "✅ Refund processed successfully! Money will be credited to your account within 3-5 business days."
        );
      }

      // Mark refund as claimed and reload refunds
      setClaimedRefunds((prev) => new Set([...prev, refundId]));
      loadRefunds();
    } catch (err) {
      console.error("Error claiming refund money:", err);
      alert(
        "❌ Failed to process refund: " + (err.response?.data || err.message)
      );
    }
  };

  const checkRefundClaimStatus = async (refundId) => {
    try {
      const isClaimed = await refundService.isRefundClaimed(refundId);
      if (isClaimed) {
        setClaimedRefunds((prev) => new Set([...prev, refundId]));
      }
    } catch (err) {
      console.error("Error checking refund claim status:", err);
    }
  };

  const handleUploadImages = async (refundId) => {
    if (uploadImages.length === 0) {
      alert("Please select images to upload");
      return;
    }

    try {
      await refundService.uploadRefundImages(refundId, uploadImages);
      alert("Images uploaded successfully");
      setShowImageModal(false);
      setUploadImages([]);
      setSelectedRefund(null);
      loadRefunds();
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Failed to upload images: " + (err.response?.data || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "requested":
      case "pending":
        return "#f39c12";
      case "approved":
        return "#27ae60";
      case "rejected":
        return "#e74c3c";
      case "refunded":
        return "#2ecc71";
      case "cancelled":
        return "#95a5a6";
      default:
        return "#95a5a6";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 VND";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Block admin access
  if (userRole === "ADMIN") {
    return (
      <div className="refund-page">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>Admin users do not have access to refund functionality.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="refund-page">
        <div className="loading">Loading refunds...</div>
      </div>
    );
  }

  return (
    <div className="refund-page">
      <div className="refund-header">
        <h1>Refund Management</h1>
        <p>Manage your refund requests and process customer refunds</p>
      </div>

      {/* Tabs */}
      <div className="refund-tabs">
        {userRole === "BUYER" && (
          <button
            className={activeTab === "buyer" ? "tab active" : "tab"}
            onClick={() => setActiveTab("buyer")}
          >
            My Refunds
          </button>
        )}
        {userRole === "SELLER" && (
          <button
            className={activeTab === "seller" ? "tab active" : "tab"}
            onClick={() => setActiveTab("seller")}
          >
            Customer Refunds
          </button>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div className="notification success">✅ {notification}</div>
      )}

      {/* Status Filter */}
      <div className="filter-section">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="ALL">All Status</option>
          <option value="REQUESTED">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="REFUNDED">Refunded</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button
          className="refresh-btn"
          onClick={loadRefunds}
          disabled={loading}
        >
          🔄 {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Refunds List */}
      <div className="refunds-list">
        {refunds.length === 0 ? (
          <div className="no-refunds">
            <p>No refunds found</p>
          </div>
        ) : (
          refunds.map((refund) => (
            <div key={refund.id} className="refund-card">
              <div className="refund-info">
                <div className="refund-header-info">
                  <h3>Refund #{refund.id}</h3>
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getStatusColor(refund.refundStatus),
                    }}
                  >
                    {refund.refundStatus}
                  </span>
                </div>

                <div className="refund-details">
                  <p>
                    <strong>Amount:</strong> {formatCurrency(refund.amount)}
                  </p>
                  <p>
                    <strong>Reason:</strong>{" "}
                    {refund.reason || "No reason provided"}
                  </p>
                  <p>
                    <strong>Created:</strong> {formatDate(refund.createdAt)}
                  </p>
                  {refund.updatedAt &&
                    refund.updatedAt !== refund.createdAt && (
                      <p>
                        <strong>Updated:</strong> {formatDate(refund.updatedAt)}
                      </p>
                    )}
                </div>

                {/* Actions */}
                <div className="refund-actions">
                  {activeTab === "buyer" && (
                    <>
                      {refund.refundStatus === "REQUESTED" && (
                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setSelectedRefund(refund);
                            setShowImageModal(true);
                          }}
                        >
                          Upload Images
                        </button>
                      )}
                      {refund.refundStatus === "APPROVED" && (
                        <>
                          {claimedRefunds.has(refund.id) ? (
                            <button className="btn btn-secondary" disabled>
                              ✅ Money Claimed
                            </button>
                          ) : (
                            <button
                              className="btn btn-success"
                              onClick={() => handleClaimMoney(refund.id)}
                            >
                              Claim Money
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {activeTab === "seller" &&
                    refund.refundStatus === "REQUESTED" && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => handleAcceptRefund(refund.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRejectRefund(refund.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}

                  {activeTab === "admin" && (
                    <>
                      {refund.refundStatus === "REQUESTED" && (
                        <>
                          <button
                            className="btn btn-success"
                            onClick={() => handleAcceptRefund(refund.id)}
                          >
                            Admin Accept
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRejectRefund(refund.id)}
                          >
                            Admin Reject
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-info"
                        onClick={() => {
                          console.log("Admin viewing refund details:", refund);
                        }}
                      >
                        View Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Upload Modal */}
      {showImageModal && selectedRefund && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Images for Refund #{selectedRefund.id}</h3>
              <button
                className="close-btn"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="file-input-section">
                <label htmlFor="refund-images">Select Images:</label>
                <input
                  type="file"
                  id="refund-images"
                  multiple
                  accept="image/*"
                  onChange={(e) => setUploadImages(Array.from(e.target.files))}
                />
                <p className="file-info">
                  {uploadImages.length > 0
                    ? `${uploadImages.length} file(s) selected`
                    : "No files selected"}
                </p>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleUploadImages(selectedRefund.id)}
                  disabled={uploadImages.length === 0}
                >
                  Upload Images
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowImageModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundPage;
