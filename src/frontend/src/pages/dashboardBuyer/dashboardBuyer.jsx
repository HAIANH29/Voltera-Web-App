import React, { useState, useEffect } from 'react';
import './dashboardBuyer.css';

const DashboardBuyer = () => {
    const [stats, setStats] = useState({
        totalOrders: 4,
        pendingOrders: 2,
        completedOrders: 2,
        totalSpent: 20000
    });

    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        // Fetch buyer statistics
        fetchBuyerStats();
        fetchRecentOrders();
    }, []);

    const fetchBuyerStats = async () => {
        try {
            // Replace with actual API call
            const response = await fetch('/api/buyer/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            // Replace with actual API call
            const response = await fetch('/api/buyer/recent-orders');
            const data = await response.json();
            setRecentOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div className="dashboard-buyer">
            <div className="dashboard-header">
                <h1>Buyer Dashboard</h1>
                <p>Welcome back! Here's your order overview.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon orders">📦</div>
                    <div className="stat-content">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pending">⏳</div>
                    <div className="stat-content">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Pending Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon completed">✅</div>
                    <div className="stat-content">
                        <h3>{stats.completedOrders}</h3>
                        <p>Completed Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon spent">💰</div>
                    <div className="stat-content">
                        <h3>${stats.totalSpent}</h3>
                        <p>Total Spent</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-orders">
                    <div className="section-header">
                        <h2>Recent Orders</h2>
                        <button className="view-all-btn">View All</button>
                    </div>
                    
                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>${order.amount}</td>
                                        <td>
                                            <button className="action-btn view">View</button>
                                            <button className="action-btn track">Track</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button className="action-card">
                            <span className="action-icon">🛒</span>
                            <span>Browse Products</span>
                        </button>
                        <button className="action-card">
                            <span className="action-icon">📋</span>
                            <span>Order History</span>
                        </button>
                        <button className="action-card">
                            <span className="action-icon">👤</span>
                            <span>Profile Settings</span>
                        </button>
                        <button className="action-card">
                            <span className="action-icon">💬</span>
                            <span>Support</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardBuyer;