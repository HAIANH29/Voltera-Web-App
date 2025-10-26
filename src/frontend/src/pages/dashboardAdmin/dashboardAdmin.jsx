// src/pages/admin/DashboardAdmin.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./dashboardAdmin.css";
import toast from "react-hot-toast";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(false);

  // Stats mock
  const stats = {
    totalUsers: 12547,
    totalListings: 3829,
    totalRevenue: 2847593,
    activeDisputes: 7,
    userGrowth: 12.5,
    listingGrowth: 8.3,
    revenueGrowth: 18.7,
  };

  // Listings (pending)
  const [pendingListings, setPendingListings] = useState([]);

  // Accounts (pending)
  const [pendingAccounts, setPendingAccounts] = useState([]);

  // Users mock
  const users = [
    { id: "U001", name: "Alice Cooper", email: "alice@example.com", status: "active" },
    { id: "U002", name: "Bob Wilson", email: "bob@example.com", status: "pending" },
  ];

  useEffect(() => {
    if (activeTab === "accounts") {
      loadPendingAccounts();
    } else if (activeTab === "listings") {
      loadPendingListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /* ===================== LISTINGS (ADMIN) ===================== */
  const loadPendingListings = async () => {
    setLoading(true);
    try {
      // BE: GET /api/post/admin/post/pending
      const res = await api.get("/api/post/admin/post/pending");
      const items = Array.isArray(res.data)
        ? res.data.map((p) => ({
            id: p.id,
            title: p.title || "Untitled",
            price: Number(p.price || 0),
            status: (p.status || "PENDING").toLowerCase(),
          }))
        : [];
      setPendingListings(items);
    } catch (error) {
      console.error("[Admin] Error loading pending listings:", error);
      setPendingListings([]);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to load pending listings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveListing = async (id) => {
    try {
      setLoading(true);
      // BE: PUT /api/post/admin/post/{postId}/approve
      await api.put(`/api/post/admin/post/${id}/approve`);
      toast.success(`Listing ${id} approved`);
      await loadPendingListings();
    } catch (error) {
      console.error("[Admin] Approve listing failed:", error);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to approve listing"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRejectListing = async (id) => {
    try {
      setLoading(true);
      // BE: PUT /api/post/admin/post/{postId}/reject (body: RejectPostRequest { reason })
      const reason = window.prompt("Reject reason?");
      await api.put(`/api/post/admin/post/${id}/reject`, { reason: reason || "Not specified" });
      toast.success(`Listing ${id} rejected`);
      await loadPendingListings();
    } catch (error) {
      console.error("[Admin] Reject listing failed:", error);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to reject listing"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== ACCOUNTS (ADMIN) ===================== */
  const loadPendingAccounts = async () => {
    setLoading(true);
    try {
      // BE: GET /api/v1/admin/accounts/pending
      // -> baseURL = /api  => FE gọi "/v1/admin/accounts/pending"
      const res = await api.get("/api/v1/admin/accounts/pending");
      const items = Array.isArray(res.data)
        ? res.data.map((a) => ({
            accountId: a.accountId || a.id,
            username: a.username || "Unknown",
            email: a.email || "",
            role: a.role || "USER",
            status: a.status || "PENDING",
          }))
        : [];
      setPendingAccounts(items);
    } catch (error) {
      console.error("[Admin] Error loading accounts:", error);
      setPendingAccounts([]);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to load pending accounts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAccount = async (accountId, email) => {
    try {
      setLoading(true);
      // BE: PUT /api/v1/admin/account/{id}/approved
      // -> baseURL = /api  => FE gọi "/v1/admin/account/{id}/approved"
      await api.put(`/api/v1/admin/account/${accountId}/approved`);
      toast.success(`Account ${email} approved`);
      await loadPendingAccounts();
    } catch (error) {
      console.error("[Admin] Approval failed:", error);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to approve account"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAccount = async (accountId, email) => {
    try {
      setLoading(true);
      // BE: PUT /api/v1/admin/account/{id}/rejected
      // -> baseURL = /api  => FE gọi "/v1/admin/account/{id}/rejected"
      await api.put(`/api/v1/admin/account/${accountId}/rejected`);
      toast.success(`Account ${email} rejected`);
      await loadPendingAccounts();
    } catch (error) {
      console.error("[Admin] Reject account failed:", error);
      toast.error(
        error?.response?.status === 401
          ? "Please login again."
          : error?.response?.status === 403
          ? "Admin role required."
          : error?.response?.data?.message || "Failed to reject account"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===================== DISPUTES MOCK ===================== */
  const disputes = [
    { id: "D001", title: "Battery mismatch", buyer: "John", seller: "Jane", amount: 12000, status: "open" },
    { id: "D002", title: "Delay compensation", buyer: "Mike", seller: "AutoPro", amount: 65000, status: "in_progress" },
  ];

  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    const cls =
      s === "approved" ? "success" : s === "pending" ? "secondary" : s === "rejected" ? "danger" : "secondary";
    return <span className={`badge ${cls}`}>{s || "pending"}</span>;
  };

  return (
    <div className="admin-inner">
      {/* --- Stats --- */}
      <div className="grid-4">
        <Stat title="Total Users" value={stats.totalUsers} delta={stats.userGrowth} icon="👥" />
        <Stat title="Total Listings" value={stats.totalListings} delta={stats.listingGrowth} icon="🚗" />
        <Stat title="Revenue" value={`$${(stats.totalRevenue / 1_000_000).toFixed(1)}M`} delta={stats.revenueGrowth} icon="💵" />
        <Stat title="Active Disputes" value={stats.activeDisputes} delta={2} icon="⚠️" tone="bad" />
      </div>

      {/* --- Tabs --- */}
      <div className="tabs">
        {["listings", "accounts", "users", "disputes"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "listings"
              ? "Pending Listings"
              : tab === "accounts"
              ? "Account Approval"
              : tab === "users"
              ? "Users"
              : "Disputes"}
          </button>
        ))}
      </div>

      {/* --- Listings --- */}
      {activeTab === "listings" && (
        <div className="card">
          <div className="card-title">Pending Listings</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                {/* Seller có thể không có do @JsonIgnore; tạm ẩn cột */}
                {/* <th>Seller</th> */}
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingListings.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.title}</td>
                  {/* <td>—</td> */}
                  <td>${Number(l.price || 0).toLocaleString()}</td>
                  <td>{renderStatusBadge(l.status)}</td>
                  <td>
                    <button className="btn primary" onClick={() => handleApproveListing(l.id)} disabled={loading}>
                      {loading ? "Processing..." : "✓ Approve"}
                    </button>
                  </td>
                </tr>
              ))}
              {pendingListings.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                    {loading ? "Loading..." : "No pending listings"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Account Approval --- */}
      {activeTab === "accounts" && (
        <div className="card">
          <div className="card-title">Pending Account Approvals</div>
          <div className="card-subtitle">Review and approve new user registrations</div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading pending accounts...</div>
            </div>
          ) : pendingAccounts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <div className="empty-title">No Pending Accounts</div>
              <div className="empty-text">All user registrations have been processed.</div>
            </div>
          ) : (
            <table className="approval-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USERNAME</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {pendingAccounts.map((account, index) => (
                  <tr key={account.accountId}>
                    <td>A{String(index + 1).padStart(3, "0")}</td>
                    <td>{account.username}</td>
                    <td>{account.email}</td>
                    <td>
                      <span className={`role-badge ${account.role?.toLowerCase() || "unknown"}`}>
                        {account.role || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge pending">{account.status}</span>
                    </td>
                    <td>
                      <div className="approval-actions">
                        <button
                          className="approve-btn"
                          onClick={() => handleApproveAccount(account.accountId, account.email)}
                          title="Approve Account"
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleRejectAccount(account.accountId, account.email)}
                          title="Reject Account"
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- Users --- */}
      {activeTab === "users" && (
        <div className="card">
          <div className="card-title">Users</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.status === "active" ? "success" : "secondary"}`}>{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Disputes --- */}
      {activeTab === "disputes" && (
        <div className="card">
          <div className="card-title">Active Disputes</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.title}</td>
                  <td>{d.buyer}</td>
                  <td>{d.seller}</td>
                  <td>${d.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${d.status === "open" ? "danger" : "secondary"}`}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, delta, icon, tone = "good" }) {
  return (
    <div className="card stat">
      <div className="card-title small">
        {title}
        <span className="emoji">{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className={`delta ${tone === "bad" ? "bad" : "good"}`}>
        {tone === "bad" ? `${delta} new` : `+${delta}%`}
      </div>
    </div>
  );
}
