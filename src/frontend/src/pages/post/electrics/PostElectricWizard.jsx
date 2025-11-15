import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CreateElectricForm from "./CreateElectricForm";
import "./electrics.css";

export default function PostElectricWizard() {
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
          message: "Please login to post electric batteries",
          from: "/post/electrics",
        },
      });
      return;
    }

    // Only SELLER can post electrics
    if (userRole !== "SELLER") {
      navigate("/", {
        replace: true,
        state: {
          message:
            "Only sellers can post electric batteries. Please register as a seller.",
        },
      });
      return;
    }
  }, [isAuthenticated, currentUser, userRole, navigate]);

  // Show loading while checking auth
  if (!isAuthenticated || !currentUser || userRole !== "SELLER") {
    return (
      <div className="electric-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <div>Checking permissions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="electric-container">
      <h1 className="pe-title">Create Electric Battery Post</h1>
      <p className="pe-sub">Post your electric battery pack for sale.</p>
      <CreateElectricForm
        currentUser={currentUser}
        onSubmit={(data) => {
          console.log("Electric post created:", data);
        }}
      />
    </div>
  );
}
