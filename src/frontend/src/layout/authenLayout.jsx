import React from "react";

import { Layout } from "antd";

import { Outlet } from "react-router-dom";
 
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
<h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Voltera</h1>
</Header>
 
      {/* 🔹 Body */}
<Content
  style={{
    flex: 1,
    padding: "0 16px",     // ↓ bớt padding (trước là 48px 24px)
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",    // ↓ nền trắng phẳng như Tesla (trước là #f5f5f5)
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

 