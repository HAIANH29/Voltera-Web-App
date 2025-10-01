import React from "react";
import "./HomePage.css";

const HERO_IMG =
  "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Model-Y-Performance-Desktop.png";

export default function HomePage() {
  return (
    <div className="home-wrap">
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
    </div>
  );
}
