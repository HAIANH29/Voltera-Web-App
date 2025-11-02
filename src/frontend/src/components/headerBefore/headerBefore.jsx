import React from "react";
import { Link /*, NavLink*/ } from "react-router-dom";
import Button from "../ui/button";
import "./headerBefore.css";

const HeaderBefore = () => {
  return (
    <header className="header-before">
      <div className="header-container">
        {/* Left: Logo */}
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img
              src="/logo-voltera.png"
              alt="Voltera Logo"
              className="logo"
              onError={(e) => { e.currentTarget.src = "/vite.svg"; }}
            />
            <span className="logo-text">Voltera</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="header-center">
          <ul className="nav-menu">
            <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/vehicles" className="nav-link">Vehicles</Link></li>
            <li className="nav-item"><Link to="/electrics" className="nav-link">Electrics</Link></li>
            <li className="nav-item"><Link to="/complaints" className="nav-link">Complaints</Link></li>
            <li className="nav-item"><Link to="/favorites" className="nav-link">Favorites</Link></li>
            <li className="nav-item"><Link to="/about" className="nav-link">About Us</Link></li>
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="header-right">
          <Link to="/login">
            <Button text="Login" variant="default" size="default" className="login-btn" />
          </Link>
          <Link to="/register">
            <Button text="Register" variant="default" size="default" className="register-btn" />
          </Link>

          {/* Mobile toggle (UI) */}
          <div className="mobile-menu-toggle">
            <button className="hamburger" aria-label="Toggle menu">
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBefore;
