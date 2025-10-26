// src/pages/login/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import "./LoginPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../config/api"; // instance có interceptors

// ===== ENV =====
const BASE_URL = import.meta.env.VITE_BACK_END_BASE_URL;          // vd: http://localhost:8080
const LOGIN_PATH = "/api/v1/auth/login"; // Fixed path to match backend
const FORCE_MOCK = String(import.meta.env.VITE_USE_MOCK || "0") === "1";

// ===== Token helpers (Cookie) =====
const setAccessToken = (accessToken) => {
  if (accessToken) {
    Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "Lax", path: "/" });
  }
};
const setRefreshToken = (refreshToken) => {
  if (refreshToken) {
    Cookies.set("refreshToken", refreshToken, { expires: 7, sameSite: "Lax", path: "/" });
  }
};
const clearTokens = () => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
};

const canUseRealApi = () => {
  if (FORCE_MOCK) return false;
  if (!BASE_URL || BASE_URL === "/") return false;
  return true;
};

// (phase 1) bạn có thể gọi BE để check tồn tại email/username nếu muốn
async function checkEmailDual(_email) {
  return true; // hiện để true cho nhanh
}

// ===== Thực thi login (mock/real) =====
async function loginApiDual({ email, password }) {
  const e = email.trim().toLowerCase();

  if (canUseRealApi()) {
    // BE đang dùng LoginRequest.getUsername() -> body phải có "username"
    console.log("🔗 Login URL:", BASE_URL + LOGIN_PATH);
    console.log("📤 Login payload:", { username: e, password: "***" });
    const res = await api.post(LOGIN_PATH, { username: e, password });
    const data = res.data ?? {};
    const accessToken = data.token;

    if (!accessToken) throw new Error("No token returned");

    // set cookie
    setAccessToken(accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken);

    // cache user (tuỳ bạn muốn lưu gì)
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        userId: data.userId,
        role: data.role,
        email: e,
        username: e,
      })
    );

    return {
      user: { userId: data.userId, role: data.role, email: e, username: e },
    };
  }

  // MOCK
  return loginMock({ email: e, password });
}

function loginMock({ email }) {
  setAccessToken("mock-access-token");
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      email,
      username: email,
      name: "Mock User",
      userId: 1,
      role: "USER",
    })
  );
  return {
    user: {
      email,
      username: email,
      name: "Mock User",
      userId: 1,
      role: "USER",
    },
  };
}

// ===== Validation schemas =====
const emailSchema = Yup.object({
  email: Yup.string().trim().email("Invalid email address.").required("Please enter your email."),
});
const passwordSchema = Yup.object({
  password: Yup.string().min(3, "Password must be at least 3 characters.").required("Please enter your password."),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formMsg, setFormMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [checking, setChecking] = useState(false);

  // Hiển thị message từ trang khác (reset password, v.v.)
  useEffect(() => {
    const message = location.state?.message;
    const type = location.state?.type;
    if (message && type === "success") {
      setSuccessMsg(message);
      // clear state để tránh hiện lại khi refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: step === 1 ? emailSchema : passwordSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setFormMsg("");
      try {
        await loginApiDual(values);
        // điều hướng về trang được yêu cầu trước đó (nếu có)
        const redirect = new URLSearchParams(window.location.search).get("redirect");
        navigate(redirect || "/");
      } catch (err) {
        console.error("Login error:", err?.response?.data || err?.message);

        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message;

        if (err?.response?.status === 401 || /bad credentials/i.test(errorMessage)) {
          setFieldError("password", "Email or password is incorrect. Please check and try again.");
        } else if (/not been approved|PENDING|APPROVE/i.test(errorMessage)) {
          setFormMsg("Your account is pending approval. Please wait for admin approval before logging in.");
        } else if (/account not found|user not found/i.test(errorMessage)) {
          setFieldError("email", "No account found with this email address.");
        } else {
          setFormMsg(errorMessage || "Login failed. Please try again.");
        }
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
    setTouched,
    validateForm,
  } = formik;

  const goNext = async () => {
    setFormMsg("");
    try {
      await emailSchema.validate({ email: values.email });
    } catch {
      setTouched({ email: true }, true);
      validateForm();
      return;
    }
    setChecking(true);
    try {
      await checkEmailDual(values.email);
      setStep(2);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="tesla-login">
      <h1 className="t-title">Sign In</h1>

      {!!successMsg && <div className="t-success t-success-global">{successMsg}</div>}
      {!!formMsg && <div className="t-error t-error-global">{formMsg}</div>}

      {step === 1 && (
        <>
          <label className="t-label" htmlFor="email">
            {/* Có thể đổi label thành "Email or Username" nếu muốn rõ hơn */}
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`t-input ${touched.email && errors.email ? "t-input-error" : ""}`}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
          />
          {touched.email && errors.email && <div className="t-error">{errors.email}</div>}

          <button
            type="button"
            className="t-btn t-btn-primary"
            onClick={goNext}
            disabled={checking}
          >
            {checking ? "Checking..." : "Next"}
          </button>

          <button
            type="button"
            className="t-link"
            onClick={() => navigate("/forgot-password")}
          >
            Trouble Signing In?
          </button>

          <div className="t-divider">
            <span>Or</span>
          </div>
          <button
            type="button"
            className="t-btn t-btn-ghost"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </>
      )}

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
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="current-password"
          />
          {touched.password && errors.password && <div className="t-error">{errors.password}</div>}

          <button type="submit" className="t-btn t-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <div className="t-links">
            <button type="button" className="t-link" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              type="button"
              className="t-link"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
