// src/layout/AuthLayout.jsx
import React from "react";
import { Layout } from "antd";
import { Outlet, Link } from "react-router-dom"; // <- thêm Link

const { Header, Content, Footer } = Layout;

export default function AuthLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 🔹 Top */}
      <Header
        style={{
          background: "#fff",
          boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <img
            src="/logo-voltera.png"
            alt="Voltera Logo"
            style={{ width: 28, height: 28, display: "block" }}
            onError={(e) => {
              e.currentTarget.src = "/vite.svg";
            }}
          />
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "#1e40af",
            }}
          >
            Voltera
          </span>
        </Link>
      </Header>

      {/* 🔹 Body */}
      <Content
        style={{
          flex: 1,
          padding: "0 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
        }}
      >
        {children ?? <Outlet />}
      </Content>

      {/* 🔹 Bottom */}
      <Footer
        style={{
          textAlign: "center",
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          padding: "16px 0",
          fontSize: 12,
          color: "#999",
        }}
      >
        © {new Date().getFullYear()} Voltera. All rights reserved.
      </Footer>
    </Layout>
  );
}
