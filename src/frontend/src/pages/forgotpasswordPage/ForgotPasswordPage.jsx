import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../config/api";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value.trim();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      // Call backend API to send OTP
      await api.post("/otp/forgot/request", null, {
        params: { email },
      });

      // Success - navigate to verify page
      navigate("/verify-email", { state: { email, purpose: "reset" } });
    } catch (err) {
      console.error("Failed to send OTP:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="card">
        <h1>Forgot Password</h1>
        <p>Please enter your email address to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            disabled={loading}
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
