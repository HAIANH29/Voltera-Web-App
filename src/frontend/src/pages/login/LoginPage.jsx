// src/pages/login/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css";

// [STEP 3] Axios config + interceptor
const BASE_URL = import.meta.env.VITE_BACK_END_BASE_URL?.replace(/\/?$/, "/");
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

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
        window.location.href = "/login";
        return Promise.reject(err);
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [STEP 4] API checkEmail
async function checkEmail(email) {
  const res = await api.post("authen/check-email", { email: email.trim() });
  return !!(res.data?.exists ?? res.data?.data?.exists);
}

// [STEP 5] API login
async function loginApi({ email, password }) {
  const res = await api.post("authen/login", { email: email.trim(), password });
  const { accessToken, refreshToken, user } = res.data?.data || {};
  if (!accessToken) throw new Error("No access token returned");

  Cookies.set("accessToken", accessToken, { expires: 1, secure: true });
  Cookies.set("refreshToken", refreshToken, { expires: 7, secure: true });
  localStorage.setItem("currentUser", JSON.stringify(user || null));
  return { user };
}

// [STEP 2] Yup schemas
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

// [STEP 1] UI component LoginPage
export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: password
  const [formMsg, setFormMsg] = useState("");

  // [STEP 2] Formik validate
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: step === 1 ? emailSchema : passwordSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setFormMsg("");
      try {
        // [STEP 5] Gọi login API
        await loginApi(values);
        // [STEP 7] Navigate khi login thành công
        navigate("/dashboard");
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again.";
        if (err?.response?.status === 401) {
          setFieldError("password", "Email or password is incorrect.");
        } else {
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

  // [STEP 4] Kiểm tra email trước khi sang step password
  const goNext = async () => {
    setFormMsg("");
    try {
      await emailSchema.validate({ email: values.email });
      const exists = await checkEmail(values.email);
      if (!exists) {
        setFieldError("email", "This email is not registered.");
        return;
      }
      setStep(2);
    } catch {
      setTouched({ email: true }, true);
      validateForm();
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
          >
            Next
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
