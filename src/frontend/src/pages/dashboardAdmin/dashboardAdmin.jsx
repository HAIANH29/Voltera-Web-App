import React, { useMemo, useState, useEffect } from "react";
import api from "../../config/api";
import "./dashboardAdmin.css";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("listings");
  const [accounts, setAccounts] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Mock data ---
  const stats = {
    totalUsers: 12547,
    totalListings: 3829,
    totalRevenue: 2847593,
    activeDisputes: 7,
    userGrowth: 12.5,
    listingGrowth: 8.3,
    revenueGrowth: 18.7,
  };

  const pendingListings = [
    {
      id: "L001",
      title: "2021 Tesla Model 3",
      seller: "John Smith",
      price: 52000,
      status: "pending",
    },
    {
      id: "L002",
      title: "BMW i4 M50 Battery Pack",
      seller: "Sarah Johnson",
      price: 15000,
      status: "review",
    },
    {
      id: "L003",
      title: "2020 Audi e-tron GT",
      seller: "Mike Chen",
      price: 78000,
      status: "pending",
    },
  ];

  const users = [
    {
      id: "U001",
      name: "Alice Cooper",
      email: "alice@example.com",
      status: "active",
    },
    {
      id: "U002",
      name: "Bob Wilson",
      email: "bob@example.com",
      status: "pending",
    },
  ];

  // Load pending accounts when component mounts or activeTab changes to accounts
  useEffect(() => {
    if (activeTab === "accounts") {
      loadPendingAccounts();
    }
  }, [activeTab]);

  const loadPendingAccounts = async () => {
    setLoading(true);
    try {
      // Gọi API backend để lấy danh sách pending accounts
      const res = await api.get("/admin/accounts/pending");
      console.log("Pending accounts loaded:", res.data);
      console.log("Total accounts:", res.data.length);
      res.data.forEach((account, index) => {
        console.log(`Account ${index}:`, {
          accountId: account.accountId,
          id: account.id,
          username: account.username,
          email: account.email,
          allFields: Object.keys(account),
        });
      });
      setPendingAccounts(res.data);
    } catch (error) {
      console.error("Error loading pending accounts:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to load pending accounts";
      alert(`Error: ${errorMsg}`);

      // Fallback to empty array if API fails
      setPendingAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Account Approval Functions ---
  const handleApproveAccount = async (accountId, email) => {
    try {
      setLoading(true);

      // Gọi API backend để approve account
      await api.put(`/admin/account/${accountId}/approved`);

      console.log(`Account ${accountId} approved successfully`);
      alert(`Account ${email} has been approved successfully!`);

      // Remove approved account from list
      setPendingAccounts((prev) =>
        prev.filter((acc) => acc.accountId !== accountId)
      );
    } catch (error) {
      console.error("Failed to approve account:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to approve account";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAccount = async (accountId, email) => {
    try {
      setLoading(true);

      // Vì backend chưa có API reject, tạm thời sử dụng mock
      // Trong production sẽ thay bằng: await api.put(`/admin/account/${accountId}/rejected`);

      console.log(`Rejecting account ${accountId} - ${email}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert(`Account ${email} has been rejected.`);

      // Remove rejected account from list
      setPendingAccounts((prev) =>
        prev.filter((acc) => acc.accountId !== accountId)
      );
    } catch (error) {
      console.error("Failed to reject account:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to reject account";
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const disputes = [
    {
      id: "D001",
      title: "Battery mismatch",
      buyer: "John",
      seller: "Jane",
      amount: 12000,
      status: "open",
    },
    {
      id: "D002",
      title: "Delay compensation",
      buyer: "Mike",
      seller: "AutoPro",
      amount: 65000,
      status: "in_progress",
    },
  ];

  const handleApprove = (id) => alert(`Approved listing ${id}`);
  const handleReject = (id) => alert(`Rejected listing ${id}`);

  return (
    <div className="admin-inner">
      {/* --- Stats --- */}
      <div className="grid-4">
        <Stat
          title="Total Users"
          value={stats.totalUsers}
          delta={stats.userGrowth}
          icon="👥"
        />
        <Stat
          title="Total Listings"
          value={stats.totalListings}
          delta={stats.listingGrowth}
          icon="🚗"
        />
        <Stat
          title="Revenue"
          value={`$${(stats.totalRevenue / 1_000_000).toFixed(1)}M`}
          delta={stats.revenueGrowth}
          icon="💵"
        />
        <Stat
          title="Active Disputes"
          value={stats.activeDisputes}
          delta={2}
          icon="⚠️"
          tone="bad"
        />
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
                <th>Seller</th>
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
                  <td>{l.seller}</td>
                  <td>${l.price.toLocaleString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        l.status === "pending" ? "secondary" : ""
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn" onClick={() => handleApprove(l.id)}>
                      Approve
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleReject(l.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- Account Approval --- */}
      {activeTab === "accounts" && (
        <div className="card">
          <div className="card-title">Pending Account Approvals</div>
          <div className="card-subtitle">
            Review and approve new user registrations
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading pending accounts...</div>
            </div>
          ) : pendingAccounts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <div className="empty-title">No Pending Accounts</div>
              <div className="empty-text">
                All user registrations have been processed.
              </div>
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
                      <span
                        className={`role-badge ${
                          account.role?.toLowerCase() || "unknown"
                        }`}
                      >
                        {account.role || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge pending">
                        {account.status}
                      </span>
                    </td>
                    <td>
                      <div className="approval-actions">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleApproveAccount(
                              account.accountId,
                              account.email
                            )
                          }
                          title="Approve Account"
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() =>
                            handleRejectAccount(
                              account.accountId,
                              account.email
                            )
                          }
                          title="Reject Account"
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
                    <span
                      className={`badge ${
                        u.status === "active" ? "success" : "secondary"
                      }`}
                    >
                      {u.status}
                    </span>
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
                    <span
                      className={`badge ${
                        d.status === "open" ? "danger" : "secondary"
                      }`}
                    >
                      {d.status}
                    </span>
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
