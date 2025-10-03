// src/pages/login/LoginPage.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

/** =========================
 *  CONFIG
 *  ========================= */
const BASE_URL = import.meta.env.VITE_BACK_END_BASE_URL?.replace(/\/?$/, "/");
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK === "1";

// Mock data cho test nhanh
const MOCK_REGISTERED_EMAILS = new Set([
  "test@voltera.com",
  "demo@example.com",
  "admin@voltera.io",
]);

// Axios instance
const api = axios.create({
  baseURL: BASE_URL || "/", // nếu chưa set, vẫn có instance
  timeout: 30000,
});

// Interceptor refresh token (chỉ chạy khi có token)
api.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("accessToken")?.replaceAll('"', "");
    if (accessToken) {
      try {
        const expMs = jwtDecode(accessToken).exp * 1000;
        if (Date.now() >= expMs) {
          const refreshToken = Cookies.get("refreshToken")?.replaceAll('"', "");
          const res = await axios.post(`${BASE_URL}auth/refresh-token`, {
            refreshToken,
          });
          const { accessToken: newAT, refreshToken: newRT } = res.data.data;
          Cookies.set("accessToken", newAT, { expires: 1, secure: true });
          Cookies.set("refreshToken", newRT, { expires: 7, secure: true });
          accessToken = newAT;
        }
      } catch (err) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        // giữ nguyên trang login khi token fail
        return Promise.reject(err);
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** =========================
 *  DUAL MODE HELPERS
 *  ========================= */

// Heuristic để quyết định có thể gọi API thật hay không
const canUseRealApi = () => {
  if (FORCE_MOCK) return false;             // ép mock qua .env
  if (!BASE_URL || BASE_URL === "/") return false; // chưa cấu hình
  return true;
};

// checkEmail – ưu tiên API thật, fallback mock khi lỗi
async function checkEmailDual(email) {
  const e = email.trim().toLowerCase();

  if (canUseRealApi()) {
    try {
      const res = await api.post("auth/check-email", { email: e });
      return Boolean(res.data?.exists ?? res.data?.data?.exists);
    } catch (err) {
      // Fallback sang mock nếu server die/CORS/lỗi đường dẫn
      // console.warn("[checkEmail] API failed, fallback to MOCK:", err?.message);
      return MOCK_REGISTERED_EMAILS.has(e);
    }
  }

  // Mock mode
  return MOCK_REGISTERED_EMAILS.has(e);
}

// loginApi – ưu tiên API thật, fallback mock khi lỗi
async function loginApiDual({ email, password }) {
  const e = email.trim().toLowerCase();

  if (canUseRealApi()) {
    try {
      const res = await api.post("auth/login", { email: e, password });
      const { accessToken, refreshToken, user } = res.data?.data || {};
      if (!accessToken) throw new Error("No access token returned");
      Cookies.set("accessToken", accessToken, { expires: 1, secure: true });
      Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true });
      localStorage.setItem("currentUser", JSON.stringify(user || null));
      return { user };
    } catch (err) {
      // Fallback sang mock để bạn vẫn test được full flow
      // console.warn("[login] API failed, fallback to MOCK:", err?.message);
      return loginMock({ email: e, password });
    }
  }

  // Mock mode
  return loginMock({ email: e, password });
}

// Logic mock login
function loginMock({ email, password }) {
  if (!MOCK_REGISTERED_EMAILS.has(email)) {
    const err = new Error("Email not registered (MOCK).");
    err.code = "MOCK_EMAIL_NOT_FOUND";
    throw err;
  }
  if (password !== "123456") {
    const err = new Error("Wrong password (hint: 123456) (MOCK).");
    err.code = "MOCK_WRONG_PASSWORD";
    throw err;
  }
  // Giả lập set "token" nhẹ nhàng để test guard khác nếu cần
  localStorage.setItem("currentUser", JSON.stringify({ email, name: "Mock User" }));
  Cookies.set("accessToken", "mock-access-token", { expires: 1, secure: true });
  Cookies.set("refreshToken", "mock-refresh-token", { expires: 7, secure: true });
  return { user: { email, name: "Mock User" } };
}

/** =========================
 *  Yup schemas
 *  ========================= */
const emailSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email address.")
    .required("Please enter your email."),
});

const passwordSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Please enter your password."),
});

/** =========================
 *  UI
 *  ========================= */
export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: password
  const [formMsg, setFormMsg] = useState("");
  const [checking, setChecking] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: step === 1 ? emailSchema : passwordSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setFormMsg("");
      try {
        await loginApiDual(values);
        navigate("/"); // về Home ở "/"
      } catch (err) {
        // Nếu là lỗi mock rõ ràng → đẩy vào field password
        if (err?.code === "MOCK_WRONG_PASSWORD") {
          setFieldError("password", err.message);
        } else if (err?.code === "MOCK_EMAIL_NOT_FOUND") {
          // Lỡ có case nhảy thẳng submit khi email chưa qua Step1
          setFieldError("email", "This email is not registered.");
          setStep(1);
        } else if (err?.response?.status === 401) {
          setFieldError("password", "Email or password is incorrect.");
        } else {
          const message =
            err?.response?.data?.message ||
            err?.message ||
            "Login failed. Please try again.";
          setFormMsg(message);
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
    setFieldError,
  } = formik;

  // Step 1: kiểm tra email
  const goNext = async () => {
    setFormMsg("");

    // 1) validate format
    try {
      await emailSchema.validate({ email: values.email });
    } catch {
      setTouched({ email: true }, true);
      validateForm();
      return;
    }

    // 2) check tồn tại (real → mock fallback)
    setChecking(true);
    try {
      const exists = await checkEmailDual(values.email);
      if (!exists) {
        setFieldError("email", "This email is not registered.");
        return;
      }
      setStep(2);
    } catch (err) {
      // chỉ hiển thị banner, không rơi vào console noise
      setFormMsg("We can't verify your email right now. Please try again later.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="tesla-login">
      <h1 className="t-title">Sign In</h1>

      {!!formMsg && <div className="t-error t-error-global">{formMsg}</div>}

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
            className={`t-input ${
              touched.email && errors.email ? "t-input-error" : ""
            }`}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
          />
          {touched.email && errors.email && (
            <div className="t-error">{errors.email}</div>
          )}

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
            className={`t-input ${
              touched.password && errors.password ? "t-input-error" : ""
            }`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="current-password"
          />
          {touched.password && errors.password && (
            <div className="t-error">{errors.password}</div>
          )}

          <button
            type="submit"
            className="t-btn t-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <button type="button" className="t-link" onClick={() => setStep(1)}>
            Back
          </button>
        </form>
      )}
    </div>
  );
}
