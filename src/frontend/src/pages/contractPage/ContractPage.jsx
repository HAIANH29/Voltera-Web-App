import React, { useEffect, useState } from "react";
import api from "../../config/api";
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

  // Fetch contract list
  const fetchContracts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/contracts/my");
      setContracts(res.data);
    } catch (err) {
      setError("Failed to load contracts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Create new contract
  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    try {
      await api.post("/api/contracts", form);
      setShowCreate(false);
      setForm({ vehicleId: "", buyerId: "", sellerId: "", price: "" });
      fetchContracts();
    } catch (err) {
      setError("Failed to create contract");
    }
    setActionLoading(false);
  };

  // Sign contract
  const handleSign = async (id) => {
    setActionLoading(true);
    setError("");
    try {
      await api.post(`/api/contracts/${id}/sign`);
      fetchContracts();
    } catch (err) {
      setError("Failed to sign contract");
    }
    setActionLoading(false);
  };

  // Cancel contract
  const handleCancel = async (id) => {
    setActionLoading(true);
    setError("");
    try {
      await api.post(`/api/contracts/${id}/cancel`);
      fetchContracts();
    } catch (err) {
      setError("Failed to cancel contract");
    }
    setActionLoading(false);
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
      {error && <div className="error-msg">{error}</div>}
      {showCreate && (
        <form className="contract-form card" onSubmit={handleCreate}>
          <h3>Create New Contract</h3>
          <div className="form-row">
            <label>Vehicle (ID):</label>
            <input
              required
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Buyer (ID):</label>
            <input
              required
              value={form.buyerId}
              onChange={(e) => setForm({ ...form, buyerId: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Seller (ID):</label>
            <input
              required
              value={form.sellerId}
              onChange={(e) => setForm({ ...form, sellerId: e.target.value })}
            />
          </div>
          <div className="form-row">
            <label>Price:</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <button className="btn" type="submit" disabled={actionLoading}>
            Create Contract
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
                <th>ID</th>
                <th>Vehicle</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.id}</td>
                  <td>{contract.vehicleId}</td>
                  <td>{contract.buyerId}</td>
                  <td>{contract.sellerId}</td>
                  <td>{contract.price}</td>
                  <td>
                    <span
                      className={`badge ${
                        contract.status === "SIGNED"
                          ? "success"
                          : contract.status === "CANCELLED"
                          ? "danger"
                          : "secondary"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    {contract.status === "PENDING" && (
                      <>
                        <button
                          className="btn"
                          disabled={actionLoading}
                          onClick={() => handleSign(contract.id)}
                        >
                          Sign
                        </button>
                        <button
                          className="btn danger"
                          disabled={actionLoading}
                          onClick={() => handleCancel(contract.id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
