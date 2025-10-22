import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { otpService } from "../../services/otpService.jsx";
import "./ResetPasswordPage.css";

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";
  const verifiedOtp = state?.verifiedOtp || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      await otpService.verifyPasswordResetOtp(email, verifiedOtp, password);
      console.log("Password reset successfully");
      navigate("/login", { 
        replace: true,
        state: { 
          message: "Password reset successfully! Please login with your new password." 
        }
      });
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Failed to reset password. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="card">
        <h1 className="t-heading">Reset Password</h1>
        <p className="t-sub">
          Enter your new password for <strong>{state?.email}</strong>
        </p>

        {error && <div className="error-message" style={{color: 'red', marginBottom: '16px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="t-label" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            type="password"
            className="t-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            disabled={submitting}
            required
          />

          <label className="t-label" htmlFor="confirm">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            className="t-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••"
            required
          />

          {error && <div className="t-error">{error}</div>}

          <button
            type="submit"
            className="t-btn t-btn-primary"
            style={{ marginTop: 16 }}
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
