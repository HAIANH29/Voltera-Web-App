// ...existing code...
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!emailPattern.test(email)) e.email = "Invalid email address.";
    if (!password) e.password = "Please enter your password.";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      console.log("Login", { email, password, remember });
      try {
        navigate("/dashboard");
      } catch {
        window.location.href = "/dashboard";
      }
    }, 900);
  }

  return (
    <div className="login-page">
      <div className="card">
        <div className="header">
          <h1 className="title">Login</h1>
          <div className="subtitle">
            Please enter your information to continue
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input ${errors.email ? "input-error" : ""}`}
              placeholder="email@example.com"
              autoComplete="email"
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input ${errors.password ? "input-error" : ""}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="password-toggle"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          <div className="form-group row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="small-btn"
              onClick={() => alert("Forgot password feature")}
            >
              Forgot password?
            </button>
          </div>

          <div className="form-group">
            <button type="submit" disabled={submitting} className="button">
              {submitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="footer">
          Don't have an account?{" "}
          <span
            className="link"
            role="button"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}
// ...existing code...
