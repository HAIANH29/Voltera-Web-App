import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../config/api";
import "./headerAfter.css";

/**
 * Header sau khi đăng nhập
 * - Lấy user từ props (ưu tiên) hoặc localStorage.currentUser
 * - Logout: xóa cookies + localStorage, đóng menu, điều hướng về "/"
 * - Đóng dropdown khi click ra ngoài hoặc nhấn ESC
 * - Dùng NavLink để hiển thị active route rõ ràng
 */

const HeaderAfter = ({ user: userProp }) => {
  const navigate = useNavigate();

  // ----- state -----
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [cartItemsCount] = useState(3); // mock
  const [userProfile, setUserProfile] = useState(null);

  // ----- refs cho click outside -----
  const userMenuRef = useRef(null);
  const postMenuRef = useRef(null);
  const avatarBtnRef = useRef(null);
  const postBtnRef = useRef(null);

  // ----- Load user profile để lấy avatar -----
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const res = await api.get("/api/v1/users/me/profile");
        setUserProfile(res.data);

        // Update localStorage with avatar
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          userData.avatar = res.data.avatar;
          localStorage.setItem("currentUser", JSON.stringify(userData));
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    };

    loadUserProfile();
  }, []);

  // ----- user hiện tại: props > localStorage -----
  const currentUser = useMemo(() => {
    if (userProp && (userProp.name || userProp.email)) {
      return {
        ...userProp,
        avatar: userProfile?.avatar || userProp.avatar,
      };
    }
    try {
      const raw = localStorage.getItem("currentUser");
      const stored = raw ? JSON.parse(raw) : null;
      if (stored && (stored.email || stored.username)) {
        return {
          ...stored,
          name: stored.name || stored.username || stored.email || "User",
          email: stored.email || stored.username || "user@example.com",
          avatar: userProfile?.avatar || stored.avatar,
        };
      }
      return {
        name: "User",
        email: "user@example.com",
        avatar: userProfile?.avatar,
      };
    } catch {
      return {
        name: "User",
        email: "user@example.com",
        avatar: userProfile?.avatar,
      };
    }
  }, [userProp, userProfile]);

  // ----- đóng dropdown khi click ra ngoài -----
  useEffect(() => {
    const onDocClick = (e) => {
      // user menu
      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target) &&
        avatarBtnRef.current &&
        !avatarBtnRef.current.contains(e.target)
      ) {
        setShowUserMenu(false);
      }
      // post menu
      if (
        showPostMenu &&
        postMenuRef.current &&
        !postMenuRef.current.contains(e.target) &&
        postBtnRef.current &&
        !postBtnRef.current.contains(e.target)
      ) {
        setShowPostMenu(false);
      }
    };

    const onEsc = (e) => {
      if (e.key === "Escape") {
        setShowUserMenu(false);
        setShowPostMenu(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [showUserMenu, showPostMenu]);

  // ----- handlers -----
  const handleLogout = async () => {
    try {
      // 1. Get username từ multiple sources
      let username =
        currentUser?.username || currentUser?.email || currentUser?.name;

      // 2. Nếu không có username trong currentUser, thử decode JWT token
      if (!username || username === "user@example.com") {
        try {
          const accessToken = Cookies.get("accessToken");
          if (accessToken) {
            // Decode JWT payload (base64 decode middle part)
            const payload = JSON.parse(atob(accessToken.split(".")[1]));
            username = payload.sub || payload.username || payload.email;
            console.log("Username from JWT token:", username);
          }
        } catch (tokenError) {
          console.error("Failed to decode JWT token:", tokenError);
        }
      }

      console.log("Current user object:", currentUser);
      console.log("Final username for logout:", username);

      // 3. Call backend logout API nếu có username hợp lệ
      if (username && username !== "user@example.com" && username !== "User") {
        try {
          await api.post("/auth/logout", null, {
            params: { username },
          });
          console.log("Backend logout successful");
        } catch (apiError) {
          // Logout errors are not critical - user can still be logged out client-side
          console.warn(
            "Backend logout failed (non-critical):",
            apiError.response?.status === 403
              ? "Token expired or unauthorized"
              : apiError.message
          );
          // Continue with client cleanup - logout should still work
        }
      } else {
        console.log("No valid username found, skipping backend logout API");
      }

      // 4. Clear client-side data
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("currentUser");

      // 5. Đóng menu & điều hướng
      setShowUserMenu(false);
      navigate("/");

      console.log("Logout completed successfully");

      // Tuỳ chọn: phát event để các nơi khác có thể lắng nghe
      // window.dispatchEvent(new Event("auth:logout"));
    } catch (err) {
      console.error("Logout error:", err);

      // Vẫn clear client-side data ngay cả khi có lỗi
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("currentUser");
      setShowUserMenu(false);
      navigate("/");

      console.log("Logout completed with error, but client cleanup done");
    }
  };

  const toggleUserMenu = () => setShowUserMenu((v) => !v);
  const togglePostMenu = () => setShowPostMenu((v) => !v);

  // ----- render -----
  return (
    <header className="header-after">
      <div className="header-container">
        {/* Logo */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img
              src="/logo-voltera.png"
              alt="Voltera Logo"
              className="logo"
              onError={(e) => {
                e.currentTarget.src = "/vite.svg"; // fallback
              }}
            />
            <span className="logo-text">Voltera</span>
          </Link>
        </div>

        {/* Nav center */}
        <nav className="header-center">
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/vehicles"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Vehicles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/electrics"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Electrics
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Favorites
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/complaints"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Complaints
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                About Us
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Actions right */}
        <div className="header-right">
          {/* Post dropdown */}
          <div className="post-menu-container" ref={postMenuRef}>
            <button
              ref={postBtnRef}
              className="post-item-btn"
              onClick={togglePostMenu}
              aria-expanded={showPostMenu}
              aria-haspopup="menu"
            >
              + Post Item
              <svg
                className={`dropdown-arrow ${showPostMenu ? "rotate" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showPostMenu && (
              <div className="post-dropdown" role="menu">
                <ul className="post-dropdown-menu">
                  <li>
                    <Link
                      to="/post/vehicles"
                      className="post-dropdown-item"
                      onClick={() => setShowPostMenu(false)}
                    >
                      <svg
                        className="dropdown-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                        />
                      </svg>
                      Post Vehicle
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/post/electrics"
                      className="post-dropdown-item"
                      onClick={() => setShowPostMenu(false)}
                    >
                      <svg
                        className="dropdown-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Post Electric
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="cart-link" aria-label="Cart">
            <div className="cart-icon-container">
              <svg
                className="cart-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L9 21h8M9 21a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </div>
          </Link>

          {/* User dropdown */}
          <div className="user-menu-container" ref={userMenuRef}>
            <button
              ref={avatarBtnRef}
              className="avatar-button"
              onClick={toggleUserMenu}
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name ?? "User"}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {(currentUser?.name?.charAt(0) || "U").toUpperCase()}
                </div>
              )}
              <svg
                className={`dropdown-arrow ${showUserMenu ? "rotate" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <div className="user-dropdown" role="menu">
                <div className="user-info">
                  <span className="user-name">
                    {currentUser?.name || "User"}
                  </span>
                  <span className="user-email">
                    {currentUser?.email || "user@example.com"}
                  </span>
                </div>
                <div className="dropdown-divider" />
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg
                        className="dropdown-icon"
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
                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg
                        className="dropdown-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                      DashBoard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/comparison"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg
                        className="dropdown-icon"
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
                      Vehicle Comparison
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contract"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg
                        className="dropdown-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      My Contracts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/refunds"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg
                        className="dropdown-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      My Refunds
                    </Link>
                  </li>
                  <li>
                    <div className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <svg
                        className="dropdown-icon"
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

        {/* Mobile menu (placeholder) */}
        <div className="mobile-menu-toggle">
          <button className="hamburger" aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderAfter;
