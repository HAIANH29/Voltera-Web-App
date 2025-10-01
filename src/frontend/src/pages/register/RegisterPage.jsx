import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import "./RegisterPage.css";

const schema = Yup.object({
  email: Yup.string().trim().email("Invalid email address.").required("Please enter your email."),
  password: Yup.string().min(6, "Password must be at least 6 characters.").required("Please enter your password."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match.")
    .required("Please confirm your password."),
});

export default function RegisterPage() {
  const navigate = useNavigate();
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
    </div>
  );
}
