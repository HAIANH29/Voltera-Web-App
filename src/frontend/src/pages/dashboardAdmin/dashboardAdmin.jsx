import React, { useMemo, useState } from "react";
import "./DashboardAdmin.css";

export default function DashboardAdmin() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  // mock data - updated to fit current requirements
  const kpis = useMemo(
    () => [
      { label: "Revenue", value: "$2.5M USD", delta: "+12.5%", key: "rev" },
      { label: "Orders", value: "3,847", delta: "+18.2%", key: "ord" },
      { label: "Active Users", value: "28,650", delta: "+7.8%", key: "usr" },
      { label: "Return Rate", value: "0.8%", delta: "-0.5%", key: "ref" },
    ],
    []
  );

  const recent = useMemo(
    () => [
      {
        id: "ORD-00125",
        customer: "John Smith",
        date: "2025-01-08",
        total: 750,
        status: "Paid",
      },
      {
        id: "ORD-00124",
        customer: "Jane Doe",
        date: "2025-01-08",
        total: 320,
        status: "Pending",
      },
      {
        id: "ORD-00123",
        customer: "Mike Johnson",
        date: "2025-01-07",
        total: 480,
        status: "Paid",
      },
      {
        id: "ORD-00122",
        customer: "Sarah Wilson",
        date: "2025-01-07",
        total: 125,
        status: "Refunded",
      },
      {
        id: "ORD-00121",
        customer: "David Brown",
        date: "2025-01-06",
        total: 890,
        status: "Paid",
      },
    ],
    []
  );

  const filtered = recent.filter(
    (r) =>
      r.id.toLowerCase().includes(query.toLowerCase()) ||
      r.customer.toLowerCase().includes(query.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="ad-root">
      {/* Sidebar */}
      <aside
        className={`ad-sidebar ${menuOpen ? "is-open" : ""}`}
        aria-label="Sidebar"
      >
        <div className="ad-brand">
          <span className="ad-logo" aria-hidden>
            ⚡
          </span>
          <span>Voltera Admin</span>
        </div>

        <nav className="ad-nav">
          <a className="ad-nav-item is-active" href="#dashboard">
            📊 Overview
          </a>
          <a className="ad-nav-item" href="#orders">
            📦 Orders
          </a>
          <a className="ad-nav-item" href="#customers">
            👥 Customers
          </a>
          <a className="ad-nav-item" href="#products">
            🛍️ Products
          </a>
          <a className="ad-nav-item" href="#analytics">
            📈 Analytics
          </a>
          <a className="ad-nav-item" href="#settings">
            ⚙️ Settings
          </a>
        </nav>

        <div className="ad-sidebar-footer">
          <button
            className="ad-btn ad-btn-outline"
            onClick={() =>
              document.documentElement.classList.toggle("theme-dark")
            }
          >
            🌙 Toggle Theme
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ad-main">
        {/* Topbar */}
        <header className="ad-topbar">
          <button
            className="ad-icon-btn ad-only-mobile"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className="ad-search">
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search"
            />
            <span className="ad-search-icon" aria-hidden>
              🔍
            </span>
          </div>

          <div className="ad-topbar-right">
            <button className="ad-icon-btn" aria-label="Notifications">
              🔔
            </button>
            <div className="ad-user">
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  avatarSvg("#8b5cf6")
                )}`}
                alt=""
              />
              <div className="ad-user-meta">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="ad-section">
          <div className="ad-welcome">
            <h1>Welcome back! 👋</h1>
            <p>Here's an overview of today's system activities.</p>
          </div>
        </section>

        {/* KPIs */}
        <section className="ad-section">
          <div className="ad-grid ad-grid-4">
            {kpis.map((k) => (
              <div className="ad-card ad-kpi" key={k.key}>
                <div className="ad-kpi-head">
                  <span className="ad-kpi-label">{k.label}</span>
                  <MiniSpark keyId={k.key} />
                </div>
                <div className="ad-kpi-row">
                  <span className="ad-kpi-value">{k.value}</span>
                  <span
                    className={`ad-kpi-delta ${
                      k.delta.startsWith("+") ? "up" : "down"
                    }`}
                  >
                    {k.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two columns: table & activity */}
        <section className="ad-section">
          <div className="ad-grid ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-head">
                <h3>Recent Orders</h3>
                <button className="ad-btn">Create New Order</button>
              </div>

              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th style={{ width: 64 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.customer}</td>
                        <td>{new Date(row.date).toLocaleDateString('en-US')}</td>
                        <td>{formatCurrency(row.total)}</td>
                        <td>
                          <span
                            className={`ad-badge ${row.status.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <div className="ad-row-actions">
                            <button className="ad-icon-btn" title="View">
                              👁️
                            </button>
                            <button className="ad-icon-btn" title="Edit">
                              ✏️
                            </button>
                            <button className="ad-icon-btn" title="More">
                              ⋯
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="6" className="ad-empty">
                          No results found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ad-card">
              <div className="ad-card-head">
                <h3>System Activity</h3>
                <button className="ad-btn ad-btn-outline">View All</button>
              </div>

              <ul className="ad-timeline">
                <li>
                  <div className="dot" />
                  <div className="content">
                    <strong>Refund Processed</strong>
                    <p>Order ORD-00122 has been refunded to Sarah Wilson.</p>
                    <time>2 hours ago</time>
                  </div>
                </li>
                <li>
                  <div className="dot" />
                  <div className="content">
                    <strong>New Customer</strong>
                    <p>Mike Johnson has created a new account.</p>
                    <time>5 hours ago</time>
                  </div>
                </li>
                <li>
                  <div className="dot" />
                  <div className="content">
                    <strong>Inventory Update</strong>
                    <p>Synchronized 342 products.</p>
                    <time>Yesterday</time>
                  </div>
                </li>
              </ul>

              <div className="ad-card-split">
                <div className="ad-progress">
                  <label>Monthly Goal</label>
                  <div className="bar">
                    <span style={{ width: "78%" }} />
                  </div>
                  <small>78% completed</small>
                </div>
                <div className="ad-progress">
                  <label>Service Quality</label>
                  <div className="bar">
                    <span style={{ width: "95%" }} />
                  </div>
                  <small>95% response within 24h</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="ad-footer">
          <small>© {new Date().getFullYear()} Voltera Admin Console · v2.0</small>
        </footer>
      </main>
    </div>
  );
}

/** ===== Helper Components ===== */
function MiniSpark({ keyId }) {
  // simple mini-line via inline SVG with random-ish shape by key
  const seeds = {
    rev: [4, 9, 12, 15, 18, 22, 28, 30],
    ord: [6, 10, 13, 19, 21, 23, 26, 29],
    usr: [3, 8, 14, 17, 20, 24, 27, 31],
    ref: [5, 7, 11, 16, 18, 20, 22, 25],
  }[keyId] || [5, 10, 15, 18, 21, 26, 28, 31];

  const points = seeds.map((x, i) => `${x},${26 - (i % 5) * 4}`).join(" ");
  return (
    <svg className="ad-spark" viewBox="0 0 32 28" aria-hidden>
      <polyline points={points} />
    </svg>
  );
}

function avatarSvg(color = "#6366f1") {
  return `
<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${color}' />
      <stop offset='1' stop-color='#22d3ee' />
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' rx='8' fill='url(#g)'/>
  <circle cx='20' cy='16' r='6' fill='white' opacity='.9'/>
  <rect x='8' y='26' width='24' height='8' rx='4' fill='white' opacity='.9'/>
</svg>`;
}
