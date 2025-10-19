import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../config/api";
import "./ResetPasswordPage.css";

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";
  const otp = state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if no email or otp
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

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

    setLoading(true);
    setError("");

    try {
      // Call backend API to reset password
      console.log("Sending password reset request:", {
        email,
        otp,
        newPassword: "***",
      });
      await api.post("/otp/forgot/verify", {
        email,
        otp,
        newPassword: password,
      });

      // Success - navigate to login with success message
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Password reset successful! Please log in with your new password.",
          type: "success",
        },
      });
    } catch (err) {
      console.error("Password reset failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to reset password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="card">
        <h1 className="t-heading">Reset Password</h1>
        <p className="t-sub">
          Enter your new password for <strong>{email}</strong>
        </p>
        <p className="t-hint">
          Make sure you entered the correct OTP code from your email.
        </p>

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
            required
            disabled={loading}
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
            disabled={loading}
          />

          {error && <div className="t-error">{error}</div>}

          <button
            type="submit"
            className="t-btn t-btn-primary"
            style={{ marginTop: 16 }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button
            type="button"
            className="t-btn t-btn-outline"
            style={{ marginTop: 12 }}
            onClick={() =>
              navigate("/verify-email", {
                state: { email, purpose: "reset" },
              })
            }
            disabled={loading}
          >
            Back to OTP Verification
          </button>
        </form>
      </div>
    </div>
  );
}
