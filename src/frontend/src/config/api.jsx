// src/config/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_BASE_URL,
  // withCredentials: true, // chỉ bật nếu backend dùng cookie
});

// Gắn Bearer token tự động (nếu có)
api.interceptors.request.use((config) => {
  // Lấy token từ cookies thay vì localStorage
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const token = getCookie("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Bắt 401 (chưa có refresh thì đưa về login)
api.interceptors.response.use(
  (res) => {
    // 🔧 Fix: Force JSON parsing if response is string but looks like JSON
    if (
      typeof res.data === "string" &&
      (res.data.startsWith("[") || res.data.startsWith("{"))
    ) {
      try {
        // Check for extremely large responses
        if (res.data.length > 200000) {
          console.warn(
            "⚠️ Very large JSON response detected:",
            res.data.length,
            "chars"
          );
          // Don't auto-parse very large responses to avoid blocking
          return res;
        }

        // Check for obvious JSON truncation/corruption
        const lastChar = res.data.trim().slice(-1);
        if (lastChar !== "}" && lastChar !== "]") {
          console.warn("⚠️ JSON appears truncated, last char:", lastChar);
          return res;
        }

        res.data = JSON.parse(res.data);
        console.log("🔧 Auto-parsed JSON string response");
      } catch (e) {
        console.warn("⚠️ Failed to auto-parse JSON:", e.message);
        // Don't throw, just return original response
      }
    }
    return res;
  },
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("access_token");
      document.cookie = "accessToken=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = "refreshToken=; Max-Age=0; path=/; SameSite=Lax";
      // Optional: lưu URL hiện tại để quay lại sau đăng nhập
      const here = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(here)}`;
    }
    return Promise.reject(err);
  }
);
console.log("API baseURL =", import.meta.env.VITE_BACK_END_BASE_URL);
export default api;
