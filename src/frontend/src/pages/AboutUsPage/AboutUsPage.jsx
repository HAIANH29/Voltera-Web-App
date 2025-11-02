import React from "react";
import "./AboutUsPage.css";

export default function AboutUsPage({ className = "" }) {
  return (
    <section className={`vt-about ${className}`}>
      {/* HERO */}
      <div className="vt-hero">
        <div className="vt-wrap">
          <p className="vt-kicker">ABOUT US</p>
          <h1 className="vt-title">
            Drive Electric. <span>Trade Smarter.</span>
          </h1>
          <p className="vt-sub">
            Voltera is a clean, modern marketplace where people and businesses
            buy, sell, and manage <strong>electric vehicles</strong> and{" "}
            <strong>EV batteries</strong> — with transparency, safety, and speed
            at its core.
          </p>
        </div>

        <div className="vt-hero-stats">
          <div className="vt-stat">
            <div className="vt-stat-num">0%*</div>
            <div className="vt-stat-label">Hidden Fees</div>
          </div>
          <div className="vt-stat">
            <div className="vt-stat-num">24/7</div>
            <div className="vt-stat-label">Secure Escrow</div>
          </div>
          <div className="vt-stat">
            <div className="vt-stat-num">1MWh+</div>
            <div className="vt-stat-label">Battery Listings</div>
          </div>
          <div className="vt-stat">
            <div className="vt-stat-num">Global</div>
            <div className="vt-stat-label">Verified Sellers</div>
          </div>
        </div>
        <p className="vt-legal">
          *Pricing is transparent. Taxes and regulatory charges may apply.
        </p>
      </div>

      {/* WHAT WE DO */}
      <div className="vt-split">
        <div className="vt-wrap">
          <div className="vt-split-col">
            <h2 className="vt-h2">What we do</h2>
            <p className="vt-p">
              We bring the <em>Tesla-like</em> simplicity to EV trading. Voltera
              connects buyers and sellers with verified inventory, real-time
              pricing, and tools to evaluate EV batteries by health, cycles,
              chemistry, and warranty.
            </p>
            <ul className="vt-list">
              <li>Marketplace for EVs, packs, and modules</li>
              <li>Battery health & lifecycle reports</li>
              <li>Secure escrow & KYC verification</li>
              <li>Logistics coordination & carbon-aware routing</li>
              <li>API for fleets, dealers, and recyclers</li>
            </ul>
          </div>

          <div className="vt-split-col vt-card-stack">
            <article className="vt-card">
              <h3 className="vt-card-title">🛒 For Buyers</h3>
              <p>
                Search by range, chemistry, state of health, and provenance.
              </p>
              <ul className="vt-card-list">
                <li>Live battery diagnostics (SOH, DOD, cycles)</li>
                <li>Certified sellers & VIN-backed histories</li>
                <li>Transparent pricing & delivery ETA</li>
              </ul>
            </article>

            <article className="vt-card">
              <h3 className="vt-card-title">💰 For Sellers</h3>
              <p>
                List EVs or battery assets in minutes—reach a global audience.
              </p>
              <ul className="vt-card-list">
                <li>Smart matching with verified demand</li>
                <li>Escrow + staged payouts</li>
                <li>Logistics + customs paperwork assist</li>
              </ul>
            </article>
          </div>
        </div>
      </div>

      {/* BATTERY FIRST */}
      <div className="vt-feature">
        <div className="vt-wrap">
          <div className="vt-feature-head">
            <p className="vt-kicker">BATTERY-FIRST</p>
            <h2 className="vt-h2">A dedicated battery marketplace</h2>
            <p className="vt-p">
              Batteries are the heart of every EV. Voltera standardizes battery
              data across chemistries (LFP, NMC, NCA) and form factors (pack,
              module, cell) to make each listing comparable, tradable, and
              insurable.
            </p>
          </div>

          <div className="vt-grid3">
            <div className="vt-tile">
              <h4>🔗 Traceability</h4>
              <p>
                Chain-of-custody from OEM to second-life with audit-ready logs.
              </p>
            </div>
            <div className="vt-tile">
              <h4>📊 Health Scoring</h4>
              <p>
                Unified score from telemetry, test benches, and warranty claims.
              </p>
            </div>
            <div className="vt-tile">
              <h4>♻️ Circularity</h4>
              <p>
                Second-life & recycling partners built into the transaction
                flow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST & SAFETY */}
      <div className="vt-safety">
        <div className="vt-wrap">
          <div className="vt-safety-inner">
            <div>
              <p className="vt-kicker">TRUST & SAFETY</p>
              <h2 className="vt-h2">Built for confidence</h2>
              <p className="vt-p">
                Every listing is reviewed. Sellers are verified. Payments are
                protected through escrow. Sensitive assets ship with compliant
                packaging and carriers.
              </p>
              <ul className="vt-list">
                <li>KYC/AML checks and contract-grade audit trail</li>
                <li>Battery transport compliance (UN38.3, IATA, ADR)</li>
                <li>Dispute resolution with independent assessors</li>
              </ul>
            </div>

            <div className="vt-cta-card">
              <h3>Ready to trade?</h3>
              <p>Create a verified business account and start listing today.</p>
              <div className="vt-actions">
                <a href="/register" className="vt-btn primary">
                  Get Started
                </a>
                <a href="/complaints" className="vt-btn">
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div className="vt-values">
        <div className="vt-wrap">
          <ul className="vt-values-list">
            <li>
              <span className="vt-cap">💎 Clarity</span>
              <p>
                No fine print. Straightforward pricing and real battery data.
              </p>
            </li>
            <li>
              <span className="vt-cap">⚡ Speed</span>
              <p>From listing to payout, we automate the boring parts.</p>
            </li>
            <li>
              <span className="vt-cap">🌱 Sustainability</span>
              <p>Built around reuse, repair, and responsible recycling.</p>
            </li>
            <li>
              <span className="vt-cap">🔒 Security</span>
              <p>Bank-grade encryption, role-based access, immutable logs.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
