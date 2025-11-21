import api from "../config/api";

// Refund status constants
export const REFUND_STATUS = {
  REQUESTED: "REQUESTED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED",
  ALL: "ALL",
};

const refundService = {
  // Create a refund request
  createRefund: async (transactionId, reason) => {
    try {
      const response = await api.post(
        `/api/refunds/request-refund/${transactionId}`,
        null,
        { params: { reason } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload images for a refund
  uploadRefundImages: async (refundId, images) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      const response = await api.post(
        `/api/refunds/${refundId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get buyer's refunds
  getBuyerRefunds: async (status = "ALL") => {
    try {
      const response = await api.get(`/api/refunds/buyer/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get seller's refunds
  getSellerRefunds: async (status = "ALL") => {
    try {
      const response = await api.get(`/api/refunds/seller/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Accept a refund (seller action)
  acceptRefund: async (refundId) => {
    try {
      const response = await api.put(`/api/refunds/accept/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reject a refund (seller action)
  rejectRefund: async (refundId) => {
    try {
      const response = await api.put(`/api/refunds/reject/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create payment URL for refund (seller action)
  createRefundPayment: async (refundId) => {
    try {
      const response = await api.post(`/api/refunds/payment/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Claim refund money (buyer action)
  claimRefundMoney: async (refundId) => {
    try {
      const response = await api.post(`/api/refunds/claim-money/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if refund has been claimed (buyer action)
  isRefundClaimed: async (refundId) => {
    try {
      const response = await api.get(`/api/refunds/is-claimed/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Legacy method for backward compatibility
  updateRefundStatus: async (refundId, status) => {
    try {
      const response = await api.put(
        `/api/refunds/update-status/${refundId}/${status}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin methods
  getAdminBuyerRefunds: async (status = "ALL") => {
    try {
      const response = await api.get(`/api/refunds/admin/buyer/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdminSellerRefunds: async (status = "ALL") => {
    try {
      const response = await api.get(`/api/refunds/admin/seller/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdminAllRefunds: async (status = "ALL") => {
    try {
      const response = await api.get(`/api/refunds/admin/all/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  adminAcceptRefund: async (refundId) => {
    try {
      const response = await api.put(`/api/refunds/admin/accept/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  adminRejectRefund: async (refundId) => {
    try {
      const response = await api.put(`/api/refunds/admin/reject/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create payment URL for refund
  createRefundPayment: async (refundId) => {
    try {
      const response = await api.post(`/api/refunds/payment/${refundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Handle payment callback
  handlePaymentCallback: async (refundId, params) => {
    try {
      const response = await api.get(
        `/api/refunds/payment/callback/${refundId}`,
        {
          params: params,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default refundService;
