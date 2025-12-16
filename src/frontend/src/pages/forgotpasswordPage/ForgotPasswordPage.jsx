import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { otpService } from "../../services/otpService.jsx";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value.trim();
    if (!email) return;

    setSubmitting(true);
    setError("");

    try {
      await otpService.requestPasswordResetOtp(email);
      navigate("/verify-email", { state: { email, purpose: "reset" } });
    } catch (err) {
      setError("Failed to send OTP. Please check your email and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="card">
        <h1>Forgot Password</h1>
        <p>Please enter your email address to reset your password.</p>
        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "16px" }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
