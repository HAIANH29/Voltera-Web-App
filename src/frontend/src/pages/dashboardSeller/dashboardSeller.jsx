import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import refundService from "../../services/refundService";
import "./dashboardSeller.css";

// 🎨 Modern SVG Icons (same as admin)
const Icons = {
  DollarSign: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ),
  Posts: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  Clock: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  ChevronUp: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ),
  TrendingUp: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  Eye: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  Refund: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  Bank: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
};

const DashboardSeller = () => {
  // � Hooks
  const navigate = useNavigate();

  // �📊 States
  const [stats, setStats] = useState({
    totalPosts: 0,
    activePosts: 0,
    pendingPosts: 0,
    walletBalance: 0,
    pendingRefunds: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Load Data
  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      // Load seller's posts and wallet info
      const user = JSON.parse(localStorage.getItem("currentUser")); // ✅ Fixed: use 'currentUser' instead of 'user'
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      // Try to get token from persist:root (Redux persist)
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        try {
          const parsedRoot = JSON.parse(persistRoot);
        } catch (e) {
          // Failed to parse persist:root
        }
      }

      if (!user) {
        toast.warn("Please login to view your dashboard");
        return;
      }

      if (user) {
        // Skip wallet for now - focus on posts first

        // Get user's posts
        const postsRes = await api.get(`/api/post/user/${user.userId}`);
        const posts = postsRes.data || [];

        // Get pending refunds for seller (REQUESTED status means pending)
        let pendingRefunds = 0;
        try {
          const refundsRes = await refundService.getSellerRefunds("REQUESTED");
          const allRefunds = refundsRes || [];
          pendingRefunds = allRefunds.length;
        } catch (error) {
          // Error loading refunds
        }

        setStats({
          totalPosts: posts.length,
          activePosts: posts.filter((p) => p.status === "APPROVED").length,
          pendingPosts: posts.filter((p) => p.status === "PENDING").length,
          walletBalance: 0, // Set to 0 for now
          pendingRefunds: pendingRefunds,
        });

        setRecentPosts(posts.slice(0, 5)); // Show recent 5 posts
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      APPROVED: { label: "Active", class: "success" },
      PENDING: { label: "Pending", class: "warning" },
      REJECTED: { label: "Rejected", class: "danger" },
      EXPIRED: { label: "Expired", class: "secondary" },
    };
    const statusInfo = statusMap[status] || {
      label: status,
      class: "secondary",
    };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="dashboard-seller">
      {/* 📊 Dashboard Content */}
      <div className="dashboard-content">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <h1>Seller Dashboard</h1>
          <p>Welcome to your seller control panel</p>
        </div>

        {/* Pending Payment Notification */}
        {stats.totalPosts > 0 && (
          <div className="payment-notification">
            <div className="notification-icon">💳</div>
            <div className="notification-content">
              <h3>Ready to go live?</h3>
              <p>
                You have {stats.totalPosts} post(s) created. Pay the posting fee
                to get them reviewed by admin and published.
              </p>
            </div>
            <button
              className="notification-btn"
              onClick={() => (window.location.href = "/transactions")}
            >
              Pay Fees Now
            </button>
          </div>
        )}

        {/* 📈 Stats Grid */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-title">Wallet Balance</div>
              <div className="stat-card-icon green">
                <Icons.DollarSign />
              </div>
            </div>
            <div className="stat-card-value">
              {formatCurrency(stats.walletBalance)}
            </div>
            <div className="stat-card-change positive">
              <Icons.ChevronUp />
              <span>Available</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-title">Total Posts</div>
              <div className="stat-card-icon blue">
                <Icons.Posts />
              </div>
            </div>
            <div className="stat-card-value">{stats.totalPosts}</div>
            <div className="stat-card-change neutral">
              <span>All listings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-title">Active Posts</div>
              <div className="stat-card-icon green">
                <Icons.Check />
              </div>
            </div>
            <div className="stat-card-value">{stats.activePosts}</div>
            <div className="stat-card-change positive">
              <Icons.ChevronUp />
              <span>Live now</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-title">Pending Posts</div>
              <div className="stat-card-icon orange">
                <Icons.Clock />
              </div>
            </div>
            <div className="stat-card-value">{stats.pendingPosts}</div>
            <div className="stat-card-change neutral">
              <span>In review</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-card-title">Pending Refunds</div>
              <div className="stat-card-icon red">
                <Icons.Refund />
              </div>
            </div>
            <div className="stat-card-value">{stats.pendingRefunds}</div>
            <div className="stat-card-change warning">
              <span>Need review</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Quick Actions */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button
                className="action-btn primary"
                onClick={() => (window.location.href = "/post/vehicles")}
              >
                <Icons.Posts />
                <span>List Vehicle</span>
              </button>
              <button
                className="action-btn secondary"
                onClick={() => (window.location.href = "/post/electrics")}
              >
                <Icons.Posts />
                <span>List Electric</span>
              </button>
              <button
                className="action-btn outline"
                onClick={() => (window.location.href = "/contract")}
              >
                <Icons.Eye />
                <span>Contracts</span>
              </button>
              <button
                className="action-btn outline"
                onClick={() => (window.location.href = "/transactions")}
              >
                <Icons.TrendingUp />
                <span>Pay Fees</span>
              </button>
              <button
                className="action-btn warning"
                onClick={() => navigate("/refunds")}
              >
                <Icons.Refund />
                <span>Manage Refunds</span>
              </button>
              <button
                className="action-btn secondary"
                onClick={() => navigate("/bank-registration")}
              >
                <Icons.Bank />
                <span>Register Bank</span>
              </button>
            </div>
          </div>

          {/* Fee Information */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">📋 Posting Fees</h2>
            </div>
            <div className="fee-info">
              <div className="fee-item">
                <div className="fee-type">🚗 Vehicle Posts</div>
                <div className="fee-amount">{formatCurrency(500000)}</div>
                <div className="fee-duration">Valid for 15 days</div>
              </div>
              <div className="fee-item">
                <div className="fee-type">🔋 Battery Posts</div>
                <div className="fee-amount">{formatCurrency(200000)}</div>
                <div className="fee-duration">Valid for 15 days</div>
              </div>
              <div className="fee-note">
                💡 <strong>How it works:</strong> After creating a post, it will
                be pending for admin review. Once approved, you'll need to pay
                the posting fee to make it live on the platform.
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">Recent Posts</h2>
            </div>
            <div className="recent-posts">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>Loading posts...</span>
                </div>
              ) : recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div key={post.postId || post.id} className="post-item">
                    <div className="post-info">
                      <h4 className="post-title">{post.title}</h4>
                      <p className="post-meta">
                        {formatCurrency(post.price)} •{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="post-status">
                      {getStatusBadge(post.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Icons.Posts />
                  <h3>No posts yet</h3>
                  <p>Start by creating your first listing</p>
                  <button
                    className="btn-primary"
                    onClick={() => (window.location.href = "/post/vehicles")}
                  >
                    Create Post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="content-card-title">Performance Overview</h2>
          </div>
          <div className="analytics-grid">
            <div className="analytics-item">
              <div className="analytics-label">Total Views</div>
              <div className="analytics-value">0</div>
              <div className="analytics-trend neutral">No data</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">Inquiries</div>
              <div className="analytics-value">0</div>
              <div className="analytics-trend neutral">No data</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">Favorites</div>
              <div className="analytics-value">0</div>
              <div className="analytics-trend neutral">No data</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">Success Rate</div>
              <div className="analytics-value">0%</div>
              <div className="analytics-trend neutral">No sales yet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;
