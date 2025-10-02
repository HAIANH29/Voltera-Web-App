import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ResetPasswordPage.css";

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const resetToken = state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    // TODO: call API reset password with resetToken + password
    console.log("Reset password:", { resetToken, password });
    navigate("/login");
  };

  return (
    <div className="reset-page">
      <div className="card">
        <h1 className="t-heading">Reset Password</h1>
        <p className="t-sub">
          Enter your new password for <strong>{state?.email}</strong>
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
