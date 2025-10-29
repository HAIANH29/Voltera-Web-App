// src/services/otpService.jsx
import api from "../config/api.jsx";

export const otpService = {
  // Đổi mật khẩu sau khi đã xác thực OTP
  async resetPassword(email, newPassword) {
    const res = await api.post("/otp/forgot/reset", {
      email,
      newPassword,
    });
    return res.data;
  },
  // Gửi OTP cho đăng ký
  async requestOtp(email) {
    const res = await api.post("/otp/request", null, {
      params: { email },
    });
    return res.data;
  },

  // Verify OTP cho đăng ký
  async verifyOtp(email, otp) {
    const res = await api.post("/otp/verify", {
      email,
      otp,
    });
    return res.data;
  },

  // Resend OTP
  async resendOtp(email) {
    const res = await api.post("/otp/resend", null, {
      params: { email },
    });
    return res.data;
  },

  // Gửi OTP cho forgot password
  async requestPasswordResetOtp(email) {
    const res = await api.post("/otp/forgot/request", null, {
      params: { email },
    });
    return res.data;
  },

  // Verify OTP và reset password
  async verifyPasswordResetOtp(email, otp, newPassword) {
    const res = await api.post("/otp/forgot/verify", {
      email,
      otp,
      newPassword,
    });
    return res.data;
  },
};
