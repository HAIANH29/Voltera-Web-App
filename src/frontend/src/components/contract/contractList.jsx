import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/contract/list");
      setContracts(res.data);
      console.log("✅ Contracts loaded:", res.data);
    } catch (err) {
      console.error("❌ Error fetching contracts:", err);
      alert("Unable to load contract list.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SIGNED":
        return "bg-green-100 text-green-800";
      case "CANCEL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewContract = (contractId) => {
    navigate(`/contract?contractId=${contractId}`);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="contract-preview">
      <div className="contract-header">
        <h2>Contract List</h2>
      </div>

      <div className="contract-content">
        {contracts.length === 0 ? (
          <div className="contract-create-new">
            <div className="contract-create-icon">📋</div>
            <p>You don't have any contracts yet.</p>
          </div>
        ) : (
          <div
            className="contract-list-items"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "0 16px",
            }}
          >
            {contracts.map((contract) => (
              <div
                key={contract.contractId}
                className="contract-list-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0, 0, 0, 0.12)";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                {/* Left side: Contract information */}
                <div
                  className="contract-left-section"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: "0 0 300px",
                  }}
                >
                  <div
                    className="contract-icon"
                    style={{
                      fontSize: "24px",
                      padding: "8px",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "8px",
                    }}
                  >
                    📋
                  </div>
                  <div className="contract-basic-info">
                    <h3
                      className="contract-title"
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      Contract #{contract.contractId}
                    </h3>
                    <p
                      className="contract-post-title"
                      style={{
                        margin: "0",
                        fontSize: "14px",
                        color: "#6b7280",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "220px",
                      }}
                    >
                      {contract.postTitle}
                    </p>
                  </div>
                </div>

                {/* Giữa: Thông tin trạng thái */}
                <div
                  className="contract-center-section"
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0 20px",
                  }}
                >
                  <div className="contract-status-info">
                    <span
                      className={`contract-status-badge ${contract.contractStatus.toLowerCase()}`}
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        backgroundColor:
                          contract.contractStatus === "SIGNED"
                            ? "#dcfce7"
                            : contract.contractStatus === "PENDING"
                            ? "#fef3c7"
                            : "#fef2f2",
                        color:
                          contract.contractStatus === "SIGNED"
                            ? "#166534"
                            : contract.contractStatus === "PENDING"
                            ? "#92400e"
                            : "#991b1b",
                      }}
                    >
                      {contract.contractStatus}
                    </span>
                    <div
                      className="contract-parties"
                      style={{
                        display: "flex",
                        gap: "16px",
                        marginTop: "8px",
                        fontSize: "13px",
                      }}
                    >
                      <span className="party-info" style={{ color: "#4b5563" }}>
                        👤 {contract.buyerName}
                      </span>
                      <span className="party-info" style={{ color: "#4b5563" }}>
                        🏪 {contract.sellerName}
                      </span>
                    </div>
                    <div
                      className="contract-sign-status"
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "6px",
                        fontSize: "12px",
                      }}
                    >
                      <span
                        className={
                          contract.signedByBuyer ? "signed" : "unsigned"
                        }
                        style={{
                          color: contract.signedByBuyer ? "#059669" : "#9ca3af",
                          fontWeight: "500",
                        }}
                      >
                        Buy: {contract.signedByBuyer ? "✅" : "❌"}
                      </span>
                      <span
                        className={
                          contract.signedBySeller ? "signed" : "unsigned"
                        }
                        style={{
                          color: contract.signedBySeller
                            ? "#059669"
                            : "#9ca3af",
                          fontWeight: "500",
                        }}
                      >
                        Sell: {contract.signedBySeller ? "✅" : "❌"}
                      </span>
                    </div>
                    {contract.signedDate && (
                      <div
                        className="contract-date"
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "4px",
                        }}
                      >
                        📅{" "}
                        {new Date(contract.signedDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bên phải: Nút action */}
                <div
                  className="contract-right-section"
                  style={{
                    flex: "0 0 140px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => handleViewContract(contract.contractId)}
                    className="contract-view-btn"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#2563eb";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#3b82f6";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
