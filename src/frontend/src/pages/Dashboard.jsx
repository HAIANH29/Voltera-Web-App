import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// Import các dashboard components
import DashboardAdmin from "./dashboardAdmin/dashboardAdmin";
import DashboardBuyer from "./dashboardBuyer/dashboardBuyer";
import DashboardSeller from "./dashboardSeller/dashboardSeller";

/**
 * Dashboard Router - Điều hướng đến đúng dashboard dựa trên role
 * - ADMIN → DashboardAdmin
 * - BUYER → DashboardBuyer
 * - SELLER → DashboardSeller
 * - Không có role/token → redirect về login
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage
  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // Kiểm tra authentication
  const isAuthenticated = !!Cookies.get("accessToken");
  const userRole = currentUser?.role;

  useEffect(() => {
    // Nếu không có token, redirect về login
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Nếu không có role, redirect về home
    if (!userRole) {
      console.warn("User has no role defined");
      navigate("/", { replace: true });
      return;
    }

    console.log("Dashboard access - User role:", userRole);
  }, [isAuthenticated, userRole, navigate]);

  // Loading state nếu đang kiểm tra auth
  if (!isAuthenticated || !userRole) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  // Render dashboard tương ứng với role
  switch (userRole.toUpperCase()) {
    case "ADMIN":
      return <DashboardAdmin />;

    case "BUYER":
      return <DashboardBuyer />;

    case "SELLER":
      return <DashboardSeller />;

    default:
      // Role không được hỗ trợ
      console.error("Unsupported user role:", userRole);
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#ff4757", marginBottom: "16px" }}>
            Access Denied
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            Your role "{userRole}" is not supported for dashboard access.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3742fa",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go to Home
          </button>
        </div>
      );
  }
};

export default Dashboard;
