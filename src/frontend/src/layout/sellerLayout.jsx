import React from "react";
import "./sellerLayout.css";

export default function SellerLayout({ children }) {
  return (
    <div className="seller-layout">
      <header className="seller-header">
        <div className="logo">Seller Panel</div>
        <nav className="seller-nav">
          <a href="/dashboard-seller">Dashboard</a>
          <a href="/post/vehicles">List Product</a>
          <a href="/contract">Contracts</a>
          <a href="/profile">Profile</a>
        </nav>
      </header>
      <div className="seller-main">
        <aside className="seller-sidebar">
          <ul>
            <li>
              <a href="/dashboard-seller">Overview</a>
            </li>
            <li>
              <a href="/post/vehicles">List Product</a>
            </li>
            <li>
              <a href="/contract">Contracts</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
          </ul>
        </aside>
        <main className="seller-content">{children}</main>
      </div>
      <footer className="seller-footer">© 2025 Voltera Seller</footer>
    </div>
  );
}
