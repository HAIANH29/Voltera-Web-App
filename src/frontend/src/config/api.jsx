import axios from "axios";

// /src/config/api.jsx
// GitHub Copilot
// Bộ helpers để giao tiếp với backend bằng axios

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Hàm lấy token từ localStorage (tuỳ project có thể đổi sang cookie hoặc redux)
const getAuthToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch {
    return null;
  }
};

// Đặt token cho client (có thể gọi khi login)
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      localStorage.setItem("token", token);
    } catch {}
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    try {
      localStorage.removeItem("token");
    } catch {}
  }
};

export const clearAuthToken = () => setAuthToken(null);

// Request interceptor: thêm token nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: chuẩn hóa lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = {
      message: "Unknown error",
      status: null,
      data: null,
    };

    if (error.response) {
      err.status = error.response.status;
      err.data = error.response.data;
      // cố gắng lấy thông điệp hay nhất từ backend
      err.message =
        (error.response.data &&
          (error.response.data.message || error.response.data.error)) ||
        error.response.statusText ||
        "Server error";
    } else if (error.request) {
      err.message = "No response from server";
    } else {
      err.message = error.message;
    }

    return Promise.reject(err);
  }
);

// Helpers cơ bản
const get = (url, params = {}, config = {}) =>
  apiClient.get(url, { params, ...config }).then((res) => res.data);

const post = (url, body = {}, config = {}) =>
  apiClient.post(url, body, config).then((res) => res.data);

const put = (url, body = {}, config = {}) =>
  apiClient.put(url, body, config).then((res) => res.data);

const del = (url, config = {}) =>
  apiClient.delete(url, config).then((res) => res.data);

// Upload file (FormData)
const upload = (url, formData, config = {}) =>
  apiClient
    .post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    })
    .then((res) => res.data);

// Download file as blob
const download = (url, params = {}, config = {}) =>
  apiClient
    .get(url, { params, responseType: "blob", ...config })
    .then((res) => res.data);

// Export mặc định
const api = {
  setAuthToken,
  clearAuthToken,
  get,
  post,
  put,
  del,
  upload,
  download,
  rawClient: apiClient, // trường hợp cần truy cập axios trực tiếp
};

export default api;
