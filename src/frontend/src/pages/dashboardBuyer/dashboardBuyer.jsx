import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import api from "../../config/api";
import "./dashboardBuyer.css";

const DashboardBuyer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalContracts: 0,
    activeContracts: 0,
    completedContracts: 0,
    totalSpent: 0,
    favoriteItems: 0,
    pendingRefunds: 0,
  });

  const [recentContracts, setRecentContracts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load contracts data
      await loadContracts();

      // Load transactions data
      await loadTransactions();

      // Load favorites count
      await loadFavoritesCount();

      // Load refunds data
      await loadRefunds();
    } catch (error) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await api.get("/api/contracts/user");
      const contracts = response.data || [];

      const activeContracts = contracts.filter(
        (c) => c.status === "ACTIVE"
      ).length;
      const completedContracts = contracts.filter(
        (c) => c.status === "COMPLETED"
      ).length;

      setStats((prev) => ({
        ...prev,
        totalContracts: contracts.length,
        activeContracts,
        completedContracts,
      }));

      setRecentContracts(contracts.slice(0, 5));
    } catch (error) {
      setRecentContracts([]);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await api.get("/api/transactions/user");
      const transactions = response.data || [];

      const totalSpent = transactions
        .filter((t) => t.transactionStatus === "DONE")
        .reduce((sum, t) => sum + (t.price || 0), 0);

      setStats((prev) => ({
        ...prev,
        totalSpent,
      }));

      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      setRecentTransactions([]);
    }
  };

  const loadFavoritesCount = async () => {
    try {
      const response = await api.get("/api/favorites");
      const favorites = response.data || [];
      setStats((prev) => ({
        ...prev,
        favoriteItems: favorites.length,
      }));
    } catch (error) {
      // Handle error silently
    }
  };

  const loadRefunds = async () => {
    try {
      const response = await api.get("/api/refunds/buyer/ALL");
      const refunds = response.data || [];
      const pendingRefunds = refunds.filter(
        (r) => r.refundStatus === "REQUESTED" || r.refundStatus === "APPROVED"
      ).length;

      setStats((prev) => ({
        ...prev,
        pendingRefunds,
      }));
    } catch (error) {
      // Handle error silently
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "done":
        return "success";
      case "pending":
      case "requested":
        return "warning";
      case "completed":
        return "info";
      case "cancelled":
      case "failed":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="dashboard-buyer">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="dashboard-buyer">
      <div className="dashboard-header">
        <h1>
          Welcome back,{" "}
          {currentUser?.fullname || currentUser?.username || "Buyer"}! 👋
        </h1>
        <p className="subtitle">Here's what's happening with your account</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalContracts}</h3>
            <p>Total Contracts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{stats.activeContracts}</h3>
            <p>Active Contracts</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedContracts}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalSpent)}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{stats.favoriteItems}</h3>
            <p>Saved Items</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{stats.pendingRefunds}</h3>
            <p>Pending Refunds</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Contracts */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Contracts</h2>
          </div>
          <div className="items-list">
            {recentContracts.length > 0 ? (
              recentContracts.map((contract) => (
                <div key={contract.id} className="item-card">
                  <div className="item-info">
                    <h4>{contract.postTitle || `Contract #${contract.id}`}</h4>
                    <p className="item-date">
                      {formatDate(contract.createdAt)}
                    </p>
                  </div>
                  <div className="item-details">
                    <span
                      className={`status-badge ${getStatusColor(
                        contract.status
                      )}`}
                    >
                      {contract.status}
                    </span>
                    {contract.amount && (
                      <span className="item-amount">
                        {formatCurrency(contract.amount)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>📋 No contracts found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/transactions" className="view-all-btn">
              View All
            </Link>
          </div>
          <div className="items-list">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="item-card">
                  <div className="item-info">
                    <h4>
                      {transaction.description ||
                        `Transaction #${transaction.id}`}
                    </h4>
                    <p className="item-date">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="item-details">
                    <span
                      className={`status-badge ${getStatusColor(
                        transaction.transactionStatus
                      )}`}
                    >
                      {transaction.transactionStatus}
                    </span>
                    <span className="item-amount">
                      {formatCurrency(transaction.price || 0)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>💳 No transactions found</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/favorites" className="action-item">
              <div className="action-icon">❤️</div>
              <div className="action-content">
                <h4>My Favorites</h4>
                <p>{stats.favoriteItems} saved items</p>
              </div>
            </Link>
            <Link to="/transactions" className="action-item">
              <div className="action-icon">💳</div>
              <div className="action-content">
                <h4>Transactions</h4>
                <p>Payment history</p>
              </div>
            </Link>
            <Link to="/refunds" className="action-item">
              <div className="action-icon">💰</div>
              <div className="action-content">
                <h4>Refunds</h4>
                <p>{stats.pendingRefunds} pending</p>
              </div>
            </Link>
            <Link to="/notificationPage" className="action-item">
              <div className="action-icon">🔔</div>
              <div className="action-content">
                <h4>Notifications</h4>
                <p>Updates & alerts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuyer;
