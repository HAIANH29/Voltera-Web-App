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
// YÊU CẦU: .env nên set BASE_URL kèm prefix /api/v1/ luôn, ví dụ:
// VITE_BACK_END_BASE_URL=http://localhost:8080/api/v1/
const rawBase = import.meta.env.VITE_BACK_END_BASE_URL || "/";
const BASE_URL = rawBase.replace(/\/?$/, "/"); // đảm bảo có trailing /
const FORCE_MOCK = import.meta.env.VITE_USE_MOCK === "1";

// Mock data để test nhanh (khi FORCE_MOCK=1 hoặc server lỗi)
const MOCK_REGISTERED_EMAILS = new Set([
  "test@voltera.com",
  "demo@example.com",
  "admin@voltera.io",
]);

/** =========================
 *  AXIOS + INTERCEPTORS
 *  ========================= */
const api = axios.create({
  baseURL: BASE_URL, // ví dụ http://localhost:8080/api/v1/
  timeout: 30000,
});

// helper set/get/remove token
const setTokens = (accessToken, refreshToken) => {
  if (accessToken) Cookies.set("accessToken", accessToken, { expires: 1 });
  if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7 });
};
const clearTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

// gọi refresh đúng với BE (@RequestParam)
async function refreshWithQueryParam() {
  const refreshToken = Cookies.get("refreshToken")?.replaceAll('"', "");
  if (!refreshToken) throw new Error("No refresh token");
  // body = null, query param ở { params: { refreshToken } }
  const res = await axios.post(`${BASE_URL}auth/refresh`, null, {
    params: { refreshToken },
    timeout: 15000,
  });

  // Hỗ trợ nhiều format response:
  const data = res.data?.data ?? res.data ?? {};
  const newAT = data.accessToken;
  const newRT = data.refreshToken || refreshToken; // có thể BE giữ nguyên RT
  if (!newAT) throw new Error("Refresh returned no accessToken");
  setTokens(newAT, newRT);
  return { accessToken: newAT, refreshToken: newRT };
}

// REQUEST: gắn Authorization + (nếu decode được) làm mới khi đã hết hạn
api.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get("accessToken")?.replaceAll('"', "");
    if (!accessToken) return config;

    // Thử decode; nếu token mock/không hợp lệ -> bỏ qua bước đánh giá hạn
    let expired = false;
    try {
      const expMs = jwtDecode(accessToken).exp * 1000;
      expired = Date.now() >= expMs;
    } catch {
      // token không decode được (mock…) => để BE tự quyết, không refresh ở đây
      expired = false;
    }

    if (expired) {
      try {
        const { accessToken: newAT } = await refreshWithQueryParam();
        accessToken = newAT;
      } catch (e) {
        clearTokens();
        // Để request hiện tại fail 401 -> response interceptor sẽ không còn refresh nữa
        // vì không có refresh token, user sẽ bị điều hướng ra login tùy nơi gọi.
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE: nếu 401 thì refresh + retry 1 lần
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    // chỉ retry 1 lần
    if (status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const { accessToken } = await refreshWithQueryParam();
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(original);
      } catch (e) {
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

/** =========================
 *  DUAL MODE HELPERS
 *  ========================= */
const canUseRealApi = () => {
  if (FORCE_MOCK) return false;
  if (!BASE_URL || BASE_URL === "/") return false;
  return true;
};

// KHÔNG GỌI check-email ở BE (vì BE không có). Step 1 chỉ validate format.
// Hàm này để giữ nguyên flow “dual mode” nếu bạn vẫn muốn check cục bộ khi mock.
async function checkEmailDual(email) {
  const e = email.trim().toLowerCase();
  if (canUseRealApi()) {
    // BE không có /auth/check-email => luôn cho qua Step 2
    return true;
  }
  // Mock mode: kiểm tra trong danh sách giả lập
  return MOCK_REGISTERED_EMAILS.has(e);
}

async function loginApiDual({ email, password }) {
  const e = email.trim().toLowerCase();

  if (canUseRealApi()) {
    try {
      // ĐÚNG back-end: POST /api/v1/auth/login
      const res = await api.post("auth/login", { email: e, password });
      const data = res.data?.data ?? res.data ?? {};
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      const user = data.user || data.profile || null;

      if (!accessToken) throw new Error("No access token returned");
      setTokens(accessToken, refreshToken);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return { user };
    } catch (err) {
      // Fallback mock để vẫn test được
      return loginMock({ email: e, password });
    }
  }

  // Mock mode
  return loginMock({ email: e, password });
}

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
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ email, name: "Mock User" })
  );
  // token mock không decode được -> đã handle try/catch ở interceptor
  setTokens("mock-access-token", "mock-refresh-token");
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
        navigate("/"); // về trang chủ
      } catch (err) {
        if (err?.code === "MOCK_WRONG_PASSWORD") {
          setFieldError("password", err.message);
        } else if (err?.code === "MOCK_EMAIL_NOT_FOUND") {
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

  // Step 1: validate format + (mock) check cục bộ
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
      const exists = await checkEmailDual(values.email);
      if (!exists) {
        setFieldError("email", "This email is not registered.");
        return;
      }
      setStep(2);
    } catch {
      // Không chặn người dùng — vì BE không có check-email
      setStep(2);
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
