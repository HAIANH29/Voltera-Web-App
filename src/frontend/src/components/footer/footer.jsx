import React from 'react';
import { Layout } from 'antd';
import './footer.css';

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer className="footer-component">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <h3>Voltera</h3>
            <p>
              Vietnam's leading electric vehicle battery and electrical equipment marketplace. 
              Connecting buyers and sellers safely and conveniently.
            </p>
            <div className="footer-social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Email">📧</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/vehicles">Vehicles</a>
              </li>
              <li>
                <a href="/electrics">Electrics</a>
              </li>
              <li>
                <a href="/support">Support</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Customer Support</h4>
            <ul className="footer-links">
              <li>
                <a href="/support">Support Center</a>
              </li>
              <li>
                <a href="/support">Contact Us</a>
              </li>
              <li>
                <a href="/about">About Voltera</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Information</h4>
            <div className="footer-contact-info">
              <p>📍 FPT University</p>
              <p>📞 (+84) 123 456 789</p>
              <p>✉️ support@voltera.vn</p>
              <p>🕒 Mon - Sun: 8:00 - 22:00</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} Voltera. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <a href="/support">Support</a>
            <a href="/about">About</a>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;