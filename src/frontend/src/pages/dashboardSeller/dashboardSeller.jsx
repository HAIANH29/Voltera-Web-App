import React from "react";
import "./dashboardSeller.css";

const DashboardSeller = () => {
  return (
    <div className="dashboard-seller">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <p>Welcome to your seller control panel</p>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Products Listed</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p className="stat-number">$0</p>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Reviews</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">List New Product</button>
            <button className="action-btn">Manage Inventory</button>
            <button className="action-btn">View Contracts</button>
            <button className="action-btn">View Transactions</button>
            <button className="action-btn">Analytics</button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <p>No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;
