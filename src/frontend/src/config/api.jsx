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
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("access_token");
      // Optional: lưu URL hiện tại để quay lại sau đăng nhập
      const here = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(here)}`;
    }
    return Promise.reject(err);
  }
);
console.log("API baseURL =", import.meta.env.VITE_BACK_END_BASE_URL);
export default api;
