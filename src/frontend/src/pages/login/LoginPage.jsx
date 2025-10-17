// src/pages/login/LoginPage.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import api from "../../config/api"; // ✅ dùng chung instance có interceptors

// ENV
const BASE_URL = import.meta.env.VITE_BACK_END_BASE_URL;
const FORCE_MOCK = false; // ✅ sửa tên biến cho khớp

// Token helpers (đang dùng Cookie)
const setAccessToken = (accessToken) => {
  if (accessToken)
    Cookies.set("accessToken", accessToken, { expires: 1, sameSite: "Lax" });
};
const clearTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

const canUseRealApi = () => {
  if (FORCE_MOCK) return false;
  if (!BASE_URL || BASE_URL === "/") return false;
  return true;
};

async function checkEmailDual(email) {
  return true;
}

async function loginApiDual({ email, password }) {
  const e = email.trim().toLowerCase();

  if (canUseRealApi()) {
    const res = await api.post("auth/login", {
      username: e, // 🔁 đổi thành email nếu backend yêu cầu
      password,
    });
    const data = res.data ?? {};
    const accessToken = data.token;
    if (!accessToken) throw new Error("No token returned");

    setAccessToken(accessToken);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ 
        userId: data.userId, 
        role: data.role,
        email: e,
        username: e
      })
    );
    return { user: { userId: data.userId, role: data.role, email: e, username: e } };
  }

  // MOCK
  return loginMock({ email: e, password });
}

function loginMock({ email, password }) {
  // ... y như cũ của bạn
  setAccessToken("mock-access-token");
  localStorage.setItem(
    "currentUser",
    JSON.stringify({ 
      email, 
      username: email,
      name: "Mock User",
      userId: 1,
      role: "USER"
    })
  );
  return { user: { email, username: email, name: "Mock User", userId: 1, role: "USER" } };
}

const emailSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email address.")
    .required("Please enter your email."),
});
const passwordSchema = Yup.object({
  password: Yup.string()
    .min(3, "Password must be at least 3 characters.")
    .required("Please enter your password."),
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

        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message;

        if (
          err?.response?.status === 401 ||
          /bad credentials/i.test(errorMessage)
        ) {
          setFieldError(
            "password",
            "Email or password is incorrect. Please check and try again."
          );
        } else if (/not been approved|PENDING/i.test(errorMessage)) {
          setFormMsg(
            "Your account is pending approval. Please wait for admin approval before logging in."
          );
        } else if (/account not found/i.test(errorMessage)) {
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
