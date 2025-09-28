import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { routes } from ".";

export default function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();

  // parse user from cookie safely
  let user = null;
  try {
    const raw = Cookies.get("user");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  const accessToken = Cookies.get("accessToken")?.replaceAll('"', "");
  const refreshToken = Cookies.get("refreshToken")?.replaceAll('"', "");

  // if tokens missing => clear auth and redirect to login
  if (!accessToken || !refreshToken) {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  // if no user or no role => redirect to login
  if (!user || !user.role) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  // roles is optional; if provided and user role not allowed => redirect to restricted or home
  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(user.role)) {
    const restrictedPath = routes.restricted || routes.home || "/";
    return <Navigate to={restrictedPath} replace />;
  }

  // authorized
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  roles: [],
};
