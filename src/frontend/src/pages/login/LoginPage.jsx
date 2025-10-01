import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./LoginPage.css";
<<<<<<< HEAD

const emailSchema = Yup.object({
  email: Yup.string().trim().email("Invalid email address.").required("Please enter your email."),
});
=======
import { Eye, EyeOff } from "lucide-react";
const schema = Yup.object({
  email: Yup.string()
>>>>>>> 2c6ec63bddf397448c92ba2c5bb3b12dd8f5d8cf

const passwordSchema = Yup.object({
  password: Yup.string().min(6, "Password must be at least 6 characters.").required("Please enter your password."),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: password

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: step === 1 ? emailSchema : passwordSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setTimeout(() => {
        console.log("Submit", values);
        setSubmitting(false);
        navigate("/dashboard");
      }, 600);
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = formik;

  const goNext = async () => {
    try {
      await emailSchema.validate({ email: values.email });
      setStep(2);
    } catch (e) {
      formik.setTouched({ email: true });
      formik.validateForm();
    }
  };

  return (
    <div className="tesla-login">
      <h1 className="t-title">Sign In</h1>

      {/* Step 1: Email */}
      {step === 1 && (
        <>
          <label className="t-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`t-input ${touched.email && errors.email ? "t-input-error" : ""}`}
            placeholder=""
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
          />
          {touched.email && errors.email && <div className="t-error">{errors.email}</div>}

          <button type="button" className="t-btn t-btn-primary" onClick={goNext}>
            Next
          </button>

          <button type="button" className="t-link" onClick={() => navigate("/forgot-password")}>
            Trouble Signing In?
          </button>

          <div className="t-divider"><span>Or</span></div>

          <button type="button" className="t-btn t-btn-ghost" onClick={() => navigate("/register")}>
            Create Account
          </button>
        </>
      )}

      {/* Step 2: Password */}
      {step === 2 && (
        <form onSubmit={handleSubmit} noValidate>
          <div className="t-email-preview">{values.email}</div>

          <label className="t-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`t-input ${touched.password && errors.password ? "t-input-error" : ""}`}
            placeholder=""
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="current-password"
          />
          {touched.password && errors.password && <div className="t-error">{errors.password}</div>}

<<<<<<< HEAD
          <button type="submit" className="t-btn t-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <button type="button" className="t-link" onClick={() => setStep(1)}>
            Back
          </button>
=======
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
>>>>>>> 2c6ec63bddf397448c92ba2c5bb3b12dd8f5d8cf
        </form>
      )}
    </div>
  );
}
