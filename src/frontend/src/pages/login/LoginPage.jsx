import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";

import * as Yup from "yup";

import "./LoginPage.css";
import { Eye, EyeOff } from "lucide-react";
const schema = Yup.object({
  email: Yup.string()

    .trim()

    .email("Invalid email address.")

    .required("Please enter your email."),

  password: Yup.string()

    .min(6, "Password must be at least 6 characters.")

    .required("Please enter your password."),

  remember: Yup.boolean(),
});

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "", remember: false },

    validationSchema: schema,

    onSubmit: (values, { setSubmitting }) => {
      // Simulate API call

      setSubmitting(true);

      setTimeout(() => {
        console.log("Login", values);

        setSubmitting(false);

        try {
          navigate("/dashboard");
        } catch {
          window.location.href = "/dashboard";
        }
      }, 900);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = formik;

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
          {/* Email */}
          <div className="form-group">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${
                touched.email && errors.email ? "input-error" : ""
              }`}
              placeholder="email@example.com"
              autoComplete="email"
            />

            {touched.email && errors.email && (
              <div className="error-text">{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input ${
                touched.password && errors.password ? "input-error" : ""
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="form-group row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="remember"
                checked={values.remember}
                onChange={(e) => setFieldValue("remember", e.target.checked)}
              />
              Remember me
            </label>
            <button
              type="button"
              className="small-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <div className="form-group">
            <button type="submit" disabled={isSubmitting} className="button">
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <div className="footer">
          Don&apos;t have an account?{" "}
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
