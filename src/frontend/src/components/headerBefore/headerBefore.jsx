import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/button';
import './headerBefore.css';

const HeaderBefore = () => {
  return (
    <header className="header-before">
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
          </ul>
        </nav>

        {/* Action buttons bên phải */}
        <div className="header-right">
          <Button
            text="+ Post Item"
            variant="default"
            size="default"
            onClick={() => console.log('Post Item clicked')}
            className="post-item-btn"
          />
          <Link to="/login">
            <Button
              text="Login"
              variant="outline"
              size="default"
              className="login-btn"
            />
          </Link>
          <Link to="/register">
            <Button
              text="Register"
              variant="default"
              size="default"
              className="register-btn"
            />
          </Link>
        </div>

        {/* Mobile menu toggle (dành cho responsive) */}
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

export default HeaderBefore;
