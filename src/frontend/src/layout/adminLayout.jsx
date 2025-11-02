import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import "./adminLayout.css";

/**
 * Admin Layout - Chỉ dành cho user có role ADMIN
 * - Kiểm tra authentication và role ADMIN
 * - Redirect về login nếu không phải admin
 * - Sidebar navigation cho admin
 * - Header admin riêng biệt
 */

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get current user from localStorage
  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.key]);

  // Check if user is authenticated and has ADMIN role
  const isAuthenticated = !!Cookies.get("accessToken");
  const isAdmin = currentUser && currentUser.role === "ADMIN";

  // Role-based access control
  useEffect(() => {
    const checkAdminAccess = () => {
      // Nếu không đăng nhập, redirect về login
      if (!isAuthenticated) {
        navigate("/login", {
          replace: true,
          state: {
            from: location.pathname,
            message: "Please login to access admin area",
          },
        });
        return;
      }

      // Nếu đăng nhập nhưng không phải ADMIN, redirect về home
      if (!isAdmin) {
        navigate("/", {
          replace: true,
          state: {
            message: "Access denied. Admin privileges required.",
          },
        });
        return;
      }

      setIsLoading(false);
    };

    checkAdminAccess();
  }, [isAuthenticated, isAdmin, navigate, location.pathname]);

  // Admin logout handler
  const handleLogout = async () => {
    try {
      // Clear tokens and user data
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("currentUser");

      // Redirect to login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if error
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("currentUser");
      navigate("/login", { replace: true });
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Verifying admin access...</p>
      </div>
    );
  }

  // Main admin layout render
  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <img
              src="/logo-voltera.png"
              alt="Voltera Admin"
              className="logo-img"
            />
            {!sidebarCollapsed && (
              <span className="logo-text">Admin Panel</span>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink
                to="/dashboard-admin"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {!sidebarCollapsed && <span>Dashboard</span>}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                {!sidebarCollapsed && <span>Users</span>}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/posts"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                {!sidebarCollapsed && <span>Posts</span>}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {!sidebarCollapsed && <span>Orders</span>}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                {!sidebarCollapsed && <span>Analytics</span>}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/complaints"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {!sidebarCollapsed && <span>Complaints</span>}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <svg
                  className="nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {!sidebarCollapsed && <span>Settings</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <Link to="/" className="back-to-site">
            <svg
              className="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {!sidebarCollapsed && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="admin-main">
        {/* Admin Header */}
        <header className="admin-header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="breadcrumb">
              <span>Admin</span>
              <span className="separator">/</span>
              <span>{location.pathname.split("/").pop() || "Dashboard"}</span>
            </div>
          </div>

          <div className="header-right">
            {/* Notifications */}
            <button className="notification-btn" aria-label="Notifications">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM11 17h5l-5 5v-5z"
                />
              </svg>
              <span className="notification-badge">3</span>
            </button>

            {/* Admin User Menu */}
            <div className="admin-user-menu">
              <button
                className="user-button"
                onClick={toggleUserMenu}
                aria-expanded={showUserMenu}
              >
                <div className="user-avatar">
                  {currentUser?.name?.charAt(0) ||
                    currentUser?.email?.charAt(0) ||
                    "A"}
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {currentUser?.name || "Admin"}
                  </span>
                  <span className="user-role">Administrator</span>
                </div>
                <svg
                  className={`dropdown-arrow ${showUserMenu ? "rotate" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-details">
                      <strong>{currentUser?.name || "Admin"}</strong>
                      <span>{currentUser?.email || "admin@voltera.com"}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/admin/profile" className="dropdown-item">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/account" className="dropdown-item">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Account Settings
                      </Link>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item logout-item"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
