// src/pages/register/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { otpService } from "../../services/otpService.jsx";
import "./RegisterPage.css";

// axios instance của bạn (đã set baseURL = VITE_BACK_END_BASE_URL, vd: http://localhost:8080/api/v1/)
import api from "../../config/api";

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
  role: Yup.string()
    .oneOf(["BUYER", "SELLER"], "Please select a valid role.")
    .required("Please select your role."),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "BUYER",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");
      setSubmitting(true);
      try {
        // payload khớp RegisterRequest backend: {username, password, role}
        const payload = {
          username: values.email.trim(), // Backend expect username field
          password: values.password,
          role: values.role, // Use selected role from form
        };

        console.log("Sending register request:", payload);

        // BE path: /api/v1/auth/register  (baseURL là http://localhost:8080)
        const res = await api.post("/api/v1/auth/register", payload);

        console.log("Register response:", res.data);

        // hỗ trợ cả 2 kiểu response: { ... } hoặc { data: {...} }
        const body = res?.data?.data ?? res?.data ?? {};

        // Nếu BE trả token (ít gặp ở register), tự lưu và cho vào app luôn
        const accessToken = body.accessToken;
        const refreshToken = body.refreshToken;

        if (accessToken) {
          Cookies.set("accessToken", accessToken, { expires: 1 });
          if (refreshToken)
            Cookies.set("refreshToken", refreshToken, { expires: 7 });
          // Nếu có trả kèm user, bạn có thể lưu:
          if (body.user || body.profile) {
            const userInfo = body.user || body.profile;
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                ...userInfo,
                email: values.email.trim(),
                username: values.email.trim(),
              })
            );
          } else {
            // Fallback: lưu thông tin cơ bản từ form
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                email: values.email.trim(),
                username: values.email.trim(),
                role: values.role, // Use selected role
              })
            );
          }
          navigate("/", { replace: true });
          return;
        }

        // Đăng ký thành công -> gửi OTP để verify email
        console.log("Registration successful, sending OTP...");
        await otpService.requestOtp(values.email.trim());
        console.log("OTP sent successfully");

        // Chuyển đến trang verify email
        navigate("/verify-email", {
          state: {
            email: values.email.trim(),
            purpose: "signup",
          },
        });
      } catch (err) {
        console.error("Register error:", err.response?.data || err.message);

        // Chuẩn hoá thông điệp lỗi
        const resp = err?.response;
        const status = resp?.status;
        let msg =
          resp?.data?.message ||
          resp?.data?.detail ||
          (Array.isArray(resp?.data?.errors) &&
            resp.data.errors[0]?.description) ||
          err?.message ||
          "Registration failed. Please try again.";

        // Gợi ý case thường gặp
        if (status === 409 || /exist/i.test(msg) || /already/i.test(msg)) {
          msg =
            "This email is already registered. Please try with a different email.";
        } else if (status === 400 && /validation/i.test(msg)) {
          msg = "Invalid data. Please check your inputs.";
        }

        setServerError(msg);
      } finally {
        setSubmitting(false);
      }
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
  } = formik;

  return (
    <div className="t-register">
      <div className="t-step">1 of 2</div>
      <h1 className="t-heading">Create Account</h1>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <label className="t-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          className={`t-input ${
            touched.email && errors.email ? "t-input-error" : ""
          }`}
          disabled={isSubmitting}
        />
        {touched.email && errors.email && (
          <div className="t-error">{errors.email}</div>
        )}

        {/* Role Selection */}
        <label className="t-label" htmlFor="role">
          Account Type
        </label>
        <select
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`t-input ${
            touched.role && errors.role ? "t-input-error" : ""
          }`}
          disabled={isSubmitting}
        >
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
        </select>
        {touched.role && errors.role && (
          <div className="t-error">{errors.role}</div>
        )}

        {/* Password */}
        <label className="t-label" htmlFor="password">
          Password
        </label>
        <div className="t-field">
          <input
            id="password"
            name="password"
            type={showPwd ? "text" : "password"}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            className={`t-input ${
              touched.password && errors.password ? "t-input-error" : ""
            }`}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="t-eye"
            aria-label={showPwd ? "Hide password" : "Show password"}
            onClick={() => setShowPwd((s) => !s)}
            onMouseDown={(e) => e.preventDefault()}
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.password && errors.password && (
          <div className="t-error">{errors.password}</div>
        )}

        {/* Confirm Password */}
        <label className="t-label" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <div className="t-field">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            className={`t-input ${
              touched.confirmPassword && errors.confirmPassword
                ? "t-input-error"
                : ""
            }`}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="t-eye"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm((s) => !s)}
            onMouseDown={(e) => e.preventDefault()}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <div className="t-error">{errors.confirmPassword}</div>
        )}

        {/* Server error */}
        {serverError && (
          <div className="t-error t-error-server">{serverError}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="t-btn t-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Next"}
        </button>
      </form>
    </div>
  );
}
