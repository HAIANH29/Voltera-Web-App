import React, { useMemo, useState } from "react";
import "./dashboardAdmin.css";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("listings");

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
        {["listings", "users", "disputes"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "listings"
              ? "Pending Listings"
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
