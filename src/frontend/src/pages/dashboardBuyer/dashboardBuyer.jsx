import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboardBuyer.css";

const DashboardBuyer = () => {
  const [stats] = useState({
    totalOrders: 12,
    pendingOrders: 3,
    completedOrders: 8,
    totalSpent: 54750,
  });

  const [recentOrders] = useState([
    { id: "ORD-001", date: "2024-10-18", status: "Delivered", amount: 1250 },
    { id: "ORD-002", date: "2024-10-16", status: "Shipping", amount: 890 },
    { id: "ORD-003", date: "2024-10-14", status: "Processing", amount: 2100 },
  ]);

  return (
    <div className="dashboard-buyer">
      <h1>Welcome to Your Dashboard! 👋</h1>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingOrders}</h3>
          <p>Pending Orders</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedOrders}</h3>
          <p>Completed Orders</p>
        </div>
        <div className="stat-card">
          <h3>${stats.totalSpent.toLocaleString()}</h3>
          <p>Total Spent</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="content-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/my-orders">View All</Link>
        </div>
        <div className="orders-list">
          {recentOrders.map((order) => (
            <div key={order.id} className="order-item">
              <div>
                <strong>#{order.id}</strong>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <span>{order.date}</span>
                <strong>${order.amount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="content-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/browse-posts" className="action-item">
            🛒 Browse Products
          </Link>
          <Link to="/favorites" className="action-item">
            ❤️ My Favorites
          </Link>
          <Link to="/contracts" className="action-item">
            📋 My Contracts
          </Link>
          <Link to="/transactions" className="action-item">
            💳 Transactions
          </Link>
          <Link to="/my-orders" className="action-item">
            📦 Order History
          </Link>
          <Link to="/buyer/settings" className="action-item">
            ⚙️ Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardBuyer;
