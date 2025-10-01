import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./RegisterPage.css";

const schema = Yup.object({

  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .required("Please enter your first name."),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .required("Please enter your last name."),

  email: Yup.string()
    .trim()
    .email("Invalid email address.")
    .required("Please enter your email."),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Please enter your password."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match.")
    .required("Please confirm your password."),
  agree: Yup.boolean()
    .oneOf([true], "You must agree to the terms to continue.")
    .required("You must agree to the terms to continue."),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {

      firstName: "",
      lastName: "",

      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    validationSchema: schema,
    onSubmit: (values, { setSubmitting }) => {
      // giả lập call API
      setSubmitting(true);
      setTimeout(() => {
        console.log("Register", values);
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
    <div className="register-page">
      <div className="card">
        <div className="header">
          <h1 className="title">Create account</h1>
          <div className="subtitle">Fill in your details to get started</div>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* First & Last name */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="label" htmlFor="firstName">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${
                  touched.firstName && errors.firstName ? "input-error" : ""
                }`}
                placeholder="e.g. Alex"
                autoComplete="given-name"
              />
              {touched.firstName && errors.firstName && (
                <div className="error-text">{errors.firstName}</div>
              )}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="lastName">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${
                  touched.lastName && errors.lastName ? "input-error" : ""
                }`}
                placeholder="e.g. Nguyen"
                autoComplete="family-name"
              />
              {touched.lastName && errors.lastName && (
                <div className="error-text">{errors.lastName}</div>
              )}
            </div>
          </div>


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
          <div className="form-group">
            <label className="label" htmlFor="password">
              Password
            </label>
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
                autoComplete="new-password"
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
            {touched.password && errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label className="label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "input-error"
                    : ""
                }`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((s) => !s)}
                className="password-toggle"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
            )}
          </div>

          {/* Terms */}
          <div className="form-group row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agree"
                checked={values.agree}
                onChange={(e) => setFieldValue("agree", e.target.checked)}
              />
              I agree to the Terms & Privacy
            </label>
            {touched.agree && errors.agree && (
              <div className="error-text">{errors.agree}</div>
            )}
          </div>

          {/* Submit */}
          <div className="form-group">
            <button type="submit" disabled={isSubmitting} className="button">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="footer">
          Already have an account?{" "}
          <span
            className="link"
            role="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}
