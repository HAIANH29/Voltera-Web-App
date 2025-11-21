import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DashboardAdmin from "../pages/dashboardAdmin/dashboardAdmin";
import DashboardBuyer from "../pages/dashboardBuyer/dashboardBuyer";
import DashboardSeller from "../pages/dashboardSeller/dashboardSeller";

/**
 * Dashboard Router Component
 * Routes user to appropriate dashboard based on their role:
 * - ADMIN → DashboardAdmin
 * - BUYER → DashboardBuyer
 * - SELLER → DashboardSeller
 * - No auth → redirect to login
 */
const Dashboard = () => {
  const navigate = useNavigate();

  // Get current user from localStorage
  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // Check authentication
  const isAuthenticated = !!Cookies.get("accessToken");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated || !currentUser) {
      navigate("/login", {
        replace: true,
        state: {
          message: "Please login to access dashboard",
          from: "/dashboard",
        },
      });
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Don't render anything while checking auth
  if (!isAuthenticated || !currentUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Checking authentication...</div>
      </div>
    );
  }

  // Render appropriate dashboard based on role
  const userRole = currentUser.role?.toUpperCase();

  switch (userRole) {
    case "ADMIN":
      return <DashboardAdmin />;

    case "BUYER":
      return <DashboardBuyer />;

    case "SELLER":
      return <DashboardSeller />;

    default:
      // Fallback for unknown roles - redirect to buyer dashboard

      return <DashboardBuyer />;
  }
};

export default Dashboard;
