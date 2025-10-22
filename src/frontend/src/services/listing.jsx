// src/services/listing.jsx
import api from "../config/api.jsx"; // đường dẫn đúng tới file bạn gửi

export const listingService = {
  // Upload 1 ảnh, BE trả List<String>
  async uploadImageOne(file, folder = "product", onProgress = () => {}) {
    const form = new FormData();
    form.append("files", file);     // ✅ đúng tên field BE: MultipartFile[] files
    form.append("folder", folder);  // ✅ gửi cùng form, KHÔNG query

    const res = await api.post(
      "/upload/product",            // ✅ -> http://localhost:8080/api/upload/product
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
    const res = await api.post("/post/create", payload); // ✅ /api/post/create
    return res.data;
  },

  // Lấy danh sách vehicles theo status
  async getVehiclesByStatus(status = "APPROVE") {
    const res = await api.get(`/post/list/${status}`); // ✅ /api/post/list/APPROVE
    return res.data;
  },

  // Lấy vehicle detail theo ID
  async getVehicleById(id) {
    const res = await api.get(`/post/${id}`); // ✅ /api/post/{id}
    return res.data;
  },
};
