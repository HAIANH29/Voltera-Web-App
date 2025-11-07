import React, { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import Cookies from "js-cookie";
import "./buyerLayout.css";

const BuyerLayout = ({ children }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="buyer-layout">
      {/* Sidebar */}
      <aside className={`buyer-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src="/logo-voltera.png" alt="Voltera" className="logo-img" />
          {!sidebarCollapsed && <span className="logo-text">Buyer Panel</span>}
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard-buyer" className="nav-link">
            📊 {!sidebarCollapsed && "Dashboard"}
          </NavLink>
          <NavLink to="/browse-posts" className="nav-link">
            🛒 {!sidebarCollapsed && "Browse Products"}
          </NavLink>
          <NavLink to="/favorites" className="nav-link">
            ❤️ {!sidebarCollapsed && "Favorites"}
          </NavLink>
          <NavLink to="/contracts" className="nav-link">
            📋 {!sidebarCollapsed && "Contracts"}
          </NavLink>
          <NavLink to="/transactions" className="nav-link">
            💳 {!sidebarCollapsed && "Transactions"}
          </NavLink>
          <NavLink to="/refunds" className="nav-link">
            💰 {!sidebarCollapsed && "Refunds"}
          </NavLink>
          <NavLink to="/my-orders" className="nav-link">
            📦 {!sidebarCollapsed && "My Orders"}
          </NavLink>
        </nav>

        <Link to="/" className="back-to-site">
          🏠 {!sidebarCollapsed && "Back to Site"}
        </Link>
      </aside>

      {/* Main Content */}
      <div className="buyer-main">
        {/* Header */}
        <header className="buyer-header">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            ☰
          </button>

          <div className="buyer-user-menu">
            <button
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {currentUser?.name?.charAt(0) || "B"}
              </div>
              <span>{currentUser?.name || "Buyer"}</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <Link to="/buyer/profile">Profile</Link>
                <Link to="/buyer/settings">Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="buyer-content">{children}</main>
      </div>
    </div>
  );
};

export default BuyerLayout;
