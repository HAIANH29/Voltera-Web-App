import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import "./RegisterPage.css";

// ⬇️ TODO: sửa path tới instance axios của bạn
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
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");
      setSubmitting(true);
      try {
        // ⬇️ Không gửi confirmPassword lên server
        const payload = {
          email: values.email.trim(),
          password: values.password,
          // TODO: nếu backend cần thêm username/phone/... thì bổ sung ở đây
        };

        // ⬇️ TODO: đổi endpoint nếu backend khác (vd: auth/register, api/v1/auth/signup)
        const res = await api.post("auth/register", payload);
        const data = res?.data?.data;

        // Nếu backend trả token/flag verify email → chuyển trang verify
        if (data?.emailVerifyToken || data?.needVerify || data?.email) {
          navigate("/verify-email", {
            state: { email: values.email.trim(), purpose: "signup" },
            replace: true,
          });
        } else {
          // Trường hợp không cần verify (tuỳ hệ thống), có thể đưa về login
          navigate("/login", { replace: true });
        }
      } catch (err) {
        // Bắt lỗi an toàn
        const resp = err?.response;
        const msg =
          resp?.data?.message ||
          resp?.data?.detail ||
          (Array.isArray(resp?.data?.errors) &&
            resp.data.errors[0]?.description) ||
          err?.message ||
          "Something went wrong. Please try again.";
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
            onMouseDown={(e) => e.preventDefault()} // tránh focus ring xấu
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

        {/* Next */}
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
