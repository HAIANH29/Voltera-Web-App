// src/pages/login/LoginPage.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import api from "../../config/api"; // dùng chung axios instance (baseURL=/api + interceptors)

// ENV
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || "/v1/auth/login"; // -> /api/v1/auth/login
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK || "0") === "1";

// Token helpers (Cookie)
const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "Lax" });
  if (refreshToken) Cookies.set("refreshToken", refreshToken, { expires: 7, sameSite: "Lax" });
};
const clearTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

async function checkEmailDual(email) {
  // TODO: nếu có API check email thì gọi tại đây; hiện để true
  return true;
}

function normalizeRole(data) {
  // Hỗ trợ nhiều format BE có thể trả về
  let role =
    data?.role ??
    (Array.isArray(data?.roles) && data.roles[0]) ??
    (Array.isArray(data?.authorities) &&
      (typeof data.authorities[0] === "string" ? data.authorities[0] : data.authorities[0]?.authority)) ??
    "USER";

  // Ưu tiên lưu cả raw lẫn normalized (bỏ prefix ROLE_)
  const roleRaw = String(role);
  const roleNorm = roleRaw.startsWith("ROLE_") ? roleRaw.slice(5) : roleRaw;
  return { roleRaw, roleNorm };
}

async function loginRealApi({ email, password }) {
  const e = email.trim().toLowerCase();

  // NOTE: Backend của bạn nhận "username". Nếu yêu cầu "email", đổi key bên dưới.
  const res = await api.post(LOGIN_PATH, {
    username: e,
    password,
  });

  const data = res.data ?? {};
  const accessToken = data.token || data.accessToken;
  const refreshToken = data.refreshToken || null;
  if (!accessToken) throw new Error("No token returned");

  setTokens({ accessToken, refreshToken });

  const { roleRaw, roleNorm } = normalizeRole(data);

  // Lưu user tối thiểu phục vụ FE
  const user = {
    userId: data.userId ?? data.id ?? null,
    email: e,
    username: e,
    role: roleRaw,         // ví dụ: "ROLE_ADMIN" hoặc "ADMIN"
    roleNorm: roleNorm,    // ví dụ: "ADMIN"
    name: data.name ?? data.fullName ?? e,
  };
  localStorage.setItem("currentUser", JSON.stringify(user));
  return { user };
}

function loginMock({ email, password }) {
  setTokens({ accessToken: "mock-access-token" });
  const user = {
    email,
    username: email,
    name: "Mock User",
    userId: 1,
    role: "USER",
    roleNorm: "USER",
  };
  localStorage.setItem("currentUser", JSON.stringify(user));
  return { user };
}

async function loginApiDual({ email, password }) {
  if (USE_MOCK) return loginMock({ email, password });
  return loginRealApi({ email, password });
}

const emailSchema = Yup.object({
  email: Yup.string().trim().email("Invalid email address.").required("Please enter your email."),
});
const passwordSchema = Yup.object({
  password: Yup.string().min(3, "Password must be at least 3 characters.").required("Please enter your password."),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formMsg, setFormMsg] = useState("");
  const [checking, setChecking] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: step === 1 ? emailSchema : passwordSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setFormMsg("");
      try {
        await loginApiDual(values);
        navigate("/");
      } catch (err) {
        console.error("Login error:", err.response?.data || err.message);

        const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message;

        if (err?.response?.status === 401 || /bad credentials/i.test(errorMessage)) {
          setFieldError("password", "Email or password is incorrect. Please check and try again.");
        } else if (/not been approved|PENDING/i.test(errorMessage)) {
          setFormMsg("Your account is pending approval. Please wait for admin approval before logging in.");
        } else if (/account not found|user not found|no account/i.test(errorMessage)) {
          setFieldError("email", "No account found with this email address.");
        } else {
          setFormMsg(errorMessage || "Login failed. Please try again.");
        }
        clearTokens();
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setTouched, validateForm } =
    formik;

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
      {!!formMsg && <div className="t-error t-error-global">{formMsg}</div>}

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
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
          />
          {touched.email && errors.email && <div className="t-error">{errors.email}</div>}

          <button type="button" className="t-btn t-btn-primary" onClick={goNext} disabled={checking}>
            {checking ? "Checking..." : "Next"}
          </button>

          <button type="button" className="t-link" onClick={() => navigate("/forgot-password")}>
            Trouble Signing In?
          </button>

          <div className="t-divider">
            <span>Or</span>
          </div>
          <button type="button" className="t-btn t-btn-ghost" onClick={() => navigate("/register")}>
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

          <button type="button" className="t-link" onClick={() => setStep(1)}>
            Back
          </button>
        </form>
      )}
    </div>
  );
}
