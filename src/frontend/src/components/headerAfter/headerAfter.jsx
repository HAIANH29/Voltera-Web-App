import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/button';
import './headerAfter.css';

const HeaderAfter = ({ user = { name: 'John Doe', avatar: null } }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [cartItemsCount] = useState(3); // Mock cart items count

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const togglePostMenu = () => {
    setShowPostMenu(!showPostMenu);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
    setShowUserMenu(false);
  };

  return (
    <header className="header-after">
      <div className="header-container">
        {/* Logo bên trái */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img 
              src="/logo-voltera.png" 
              alt="Voltera Logo" 
              className="logo"
              onError={(e) => {
                e.target.src = '/vite.svg'; // Fallback logo
              }}
            />
            <span className="logo-text">Voltera</span>
          </Link>
        </div>

        {/* Navigation menu ở giữa */}
        <nav className="header-center">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/vehicles" className="nav-link">
                Vehicles
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/electrics" className="nav-link">
                Electrics
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/support" className="nav-link">
                Support
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/favorites" className="nav-link">
                Favorites
              </Link>
            </li>
            {/* Thêm About Us */}
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action buttons bên phải */}
        <div className="header-right">
          {/* Post Item Button with Dropdown */}
          <div className="post-menu-container">
            <button
              className="post-item-btn"
              onClick={togglePostMenu}
              onBlur={() => setTimeout(() => setShowPostMenu(false), 200)}
            >
              + Post Item
              <svg 
                className={`dropdown-arrow ${showPostMenu ? 'rotate' : ''}`}
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

            {/* Post Dropdown Menu */}
            {showPostMenu && (
              <div className="post-dropdown">
                <ul className="post-dropdown-menu">
                  <li>
                    <Link 
                      to="/post-vehicle" 
                      className="post-dropdown-item"
                      onClick={() => setShowPostMenu(false)}
                    >
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Post Vehicle
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/post-electric" 
                      className="post-dropdown-item"
                      onClick={() => setShowPostMenu(false)}
                    >
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Post Electric
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="cart-link">
            <div className="cart-icon-container">
              <svg 
                className="cart-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
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

          {/* User Avatar & Dropdown */}
          <div className="user-menu-container">
            <button 
              className="avatar-button"
              onClick={toggleUserMenu}
              onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <svg 
                className={`dropdown-arrow ${showUserMenu ? 'rotate' : ''}`}
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

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email || 'user@example.com'}</span>
                </div>
                <div className="dropdown-divider"></div>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className="dropdown-item">
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="dropdown-item">
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
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
                      <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="mobile-menu-toggle">
          <button className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderAfter;
