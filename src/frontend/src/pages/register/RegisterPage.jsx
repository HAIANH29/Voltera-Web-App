import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
<<<<<<< HEAD
import { Eye, EyeOff } from "lucide-react";
import "./RegisterPage.css";

const schema = Yup.object({
  email: Yup.string().trim().email("Invalid email address.").required("Please enter your email."),
  password: Yup.string().min(6, "Password must be at least 6 characters.").required("Please enter your password."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match.")
    .required("Please confirm your password."),
=======
import "./RegisterPage.css";

const schema = Yup.object({
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
>>>>>>> 2c6ec63bddf397448c92ba2c5bb3b12dd8f5d8cf
});

export default function RegisterPage() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setTimeout(() => {
        console.log("Register payload:", values);
        setSubmitting(false);
        // qua OTP (step 2/2)
       navigate("/verify-email", { state: { email: values.email } });
      }, 500);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

  return (
    <div className="t-register">
      <div className="t-step">1 of 2</div>
      <h1 className="t-heading">Create Account</h1>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <label className="t-label" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          className={`t-input ${touched.email && errors.email ? "t-input-error" : ""}`}
        />
        {touched.email && errors.email && <div className="t-error">{errors.email}</div>}

        {/* Password */}
        <label className="t-label" htmlFor="password">Password</label>
        <div className="t-field">
          <input
            id="password"
            name="password"
            type={showPwd ? "text" : "password"}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            className={`t-input ${touched.password && errors.password ? "t-input-error" : ""}`}
          />
          <button
            type="button"
            className="t-eye"
            aria-label={showPwd ? "Hide password" : "Show password"}
            onClick={() => setShowPwd(s => !s)}
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.password && errors.password && <div className="t-error">{errors.password}</div>}

        {/* Confirm Password */}
        <label className="t-label" htmlFor="confirmPassword">Confirm Password</label>
        <div className="t-field">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            className={`t-input ${touched.confirmPassword && errors.confirmPassword ? "t-input-error" : ""}`}
          />
          <button
            type="button"
            className="t-eye"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm(s => !s)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && <div className="t-error">{errors.confirmPassword}</div>}

        {/* Next */}
        <button type="submit" className="t-btn t-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Next"}
        </button>
      </form>
=======
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
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
>>>>>>> 2c6ec63bddf397448c92ba2c5bb3b12dd8f5d8cf
    </div>
  );
}
