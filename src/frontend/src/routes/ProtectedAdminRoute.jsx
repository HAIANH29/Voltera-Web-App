import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * Protected Admin Route Component
 * Chỉ cho phép user có role ADMIN truy cập
 */
const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation();

  // Check authentication
  const isAuthenticated = !!Cookies.get("accessToken");

  // Get current user and check role
  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = currentUser && currentUser.role === "ADMIN";

  // Redirect logic
  if (!isAuthenticated) {
    // Not logged in - redirect to login with return URL
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          message: "Please login to access admin area",
        }}
        replace
      />
    );
  }

  if (!isAdmin) {
    // Logged in but not admin - redirect to home
    return (
      <Navigate
        to="/"
        state={{
          message: "Access denied. Admin privileges required.",
        }}
        replace
      />
    );
  }

  // User is authenticated and is admin
  return children;
};

export default ProtectedAdminRoute;
