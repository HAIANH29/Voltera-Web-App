// src/pages/post/vehicles/PostVehicleWizard.jsx
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CreateListingForm from "./CreateListingForm";

export default function PostVehicleWizard() {
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

  // Check authentication and role
  const isAuthenticated = !!Cookies.get("accessToken");
  const userRole = currentUser?.role?.toUpperCase();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated || !currentUser) {
      navigate("/login", {
        replace: true,
        state: {
          message: "Please login to post a vehicle",
          from: "/post/vehicles",
        },
      });
      return;
    }

    // Only SELLER can post vehicles
    if (userRole !== "SELLER") {
      navigate("/", {
        replace: true,
        state: {
          message: "Only sellers can post vehicles. Please register as a seller.",
        },
      });
      return;
    }
  }, [isAuthenticated, currentUser, userRole, navigate]);

  // Show loading while checking auth
  if (!isAuthenticated || !currentUser || userRole !== "SELLER") {
    return (
      <div className="vehicle-container">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "50vh" 
        }}>
          <div>Checking permissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicle-container">
      <h1 className="pv-title">Create Vehicle Post</h1>
      <p className="pv-sub">Post your electric vehicle for sale.</p>
      <CreateListingForm listingType="vehicle" currentUser={currentUser} />
    </div>
  );
}
