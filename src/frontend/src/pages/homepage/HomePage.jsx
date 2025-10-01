import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HERO_IMG =
  "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-Y-Performance-Desktop.png";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-wrap">
      {/* Nav */}
      <header className="home-nav">
        <div className="home-brand" onClick={() => navigate("/")}>
          Voltera
        </div>
        <nav className="home-links">
          <button className="nav-btn ghost" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="nav-btn primary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </nav>
      </header>

      {/* Welcome heading phía trên ảnh */}
      <div className="welcome-section">
        <h1 className="v-h1">
          Welcome to <span className="v-gradient">Voltera</span>
        </h1>
        <p className="v-sub">Fast, clean, and modern.</p>
      </div>

      {/* Hero banner ảnh */}
      <section className="home-hero">
        <img className="hero-img" src={HERO_IMG} alt="Voltera Model Y" />
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div>© {new Date().getFullYear()} Voltera</div>
      </footer>
    </div>
  );
}
