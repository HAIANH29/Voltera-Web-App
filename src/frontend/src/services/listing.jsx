// src/services/listing.jsx
import api from "../config/api.jsx"; // đường dẫn đúng tới file bạn gửi

export const listingService = {
  // Upload 1 ảnh, BE trả List<String>
  async uploadImageOne(file, folder = "product", onProgress = () => {}) {
    const form = new FormData();
    form.append("files", file);     // ✅ đúng tên field BE: MultipartFile[] files
    form.append("folder", folder);  // ✅ gửi cùng form, KHÔNG query

    const res = await api.post(
      "/api/upload/product",        // ✅ -> http://localhost:8080/api/upload/product
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          if (!ev.total) return;
          onProgress(Math.round((ev.loaded * 100) / ev.total));
        },
      }
    );

    const data = res?.data;
    return Array.isArray(data) ? data[0] || null : data || null;
  },

  // Tạo post (vehicle)
  async createPost(payload) {
    try {
      console.log("🚀 Creating post with payload:", payload);
      const res = await api.post("/api/post/create", payload); // ✅ /api/post/create
      console.log("✅ Post created successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Create post failed:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error;
    }
  },


};
