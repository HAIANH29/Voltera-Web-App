import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
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

  // ----- refs cho click outside -----
  const userMenuRef = useRef(null);
  const postMenuRef = useRef(null);
  const avatarBtnRef = useRef(null);
  const postBtnRef = useRef(null);

  // ----- user hiện tại: props > localStorage -----
  const currentUser = useMemo(() => {
    if (userProp && (userProp.name || userProp.email)) return userProp;
    try {
      const raw = localStorage.getItem("currentUser");
      return raw
        ? JSON.parse(raw)
        : { name: "User", email: "user@example.com" };
    } catch {
      return { name: "User", email: "user@example.com" };
    }
  }, [userProp]);

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
  const handleLogout = () => {
    try {
      // Xoá token & user (nhớ path: "/" cho chắc chắn)
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      localStorage.removeItem("currentUser");

      // Đóng menu & điều hướng
      setShowUserMenu(false);
      navigate("/");

      // Tuỳ chọn: phát event để các nơi khác có thể lắng nghe
      // window.dispatchEvent(new Event("auth:logout"));
    } catch (err) {
      console.error("Logout error:", err);
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
                to="/support"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Support
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
                    </Link >
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
                      to="/orders"
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
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
