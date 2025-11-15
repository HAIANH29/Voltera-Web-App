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
      console.log(
        `Creating refund for transaction ${transactionId} with reason: ${reason}`
      );
      const response = await api.post(
        `/api/refunds/request-refund/${transactionId}`,
        null,
        { params: { reason } }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating refund:", error);
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

      console.log(`Uploading ${images.length} images for refund ${refundId}`);
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
      console.error("Error uploading refund images:", error);
      throw error;
    }
  },

  // Get buyer's refunds
  getBuyerRefunds: async (status = "ALL") => {
    try {
      console.log(`Fetching buyer refunds with status: ${status}`);
      const response = await api.get(`/api/refunds/buyer/${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching buyer refunds:", error);
      throw error;
    }
  },

  // Get seller's refunds
  getSellerRefunds: async (status = "ALL") => {
    try {
      console.log(`Fetching seller refunds with status: ${status}`);
      const response = await api.get(`/api/refunds/seller/${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching seller refunds:", error);
      throw error;
    }
  },

  // Accept a refund (seller action)
  acceptRefund: async (refundId) => {
    try {
      console.log(`Accepting refund ${refundId}`);
      const response = await api.put(`/api/refunds/accept/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error accepting refund:", error);
      throw error;
    }
  },

  // Reject a refund (seller action)
  rejectRefund: async (refundId) => {
    try {
      console.log(`Rejecting refund ${refundId}`);
      const response = await api.put(`/api/refunds/reject/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error rejecting refund:", error);
      throw error;
    }
  },

  // Create payment URL for refund (seller action)
  createRefundPayment: async (refundId) => {
    try {
      console.log(`Creating payment for refund ${refundId}`);
      const response = await api.post(`/api/refunds/payment/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error creating refund payment:", error);
      throw error;
    }
  },

  // Claim refund money (buyer action)
  claimRefundMoney: async (refundId) => {
    try {
      console.log(`Claiming refund money for refund ${refundId}`);
      const response = await api.post(`/api/refunds/claim-money/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error claiming refund money:", error);
      throw error;
    }
  },

  // Check if refund has been claimed (buyer action)
  isRefundClaimed: async (refundId) => {
    try {
      console.log(`Checking if refund ${refundId} has been claimed`);
      const response = await api.get(`/api/refunds/is-claimed/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error checking refund claim status:", error);
      throw error;
    }
  },

  // Legacy method for backward compatibility
  updateRefundStatus: async (refundId, status) => {
    try {
      console.log(`Updating refund ${refundId} status to ${status}`);
      const response = await api.put(
        `/api/refunds/update-status/${refundId}/${status}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating refund status:", error);
      throw error;
    }
  },

  // Admin methods
  getAdminBuyerRefunds: async (status = "ALL") => {
    try {
      console.log(`Admin fetching buyer refunds with status: ${status}`);
      const response = await api.get(`/api/refunds/admin/buyer/${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin buyer refunds:", error);
      throw error;
    }
  },

  getAdminSellerRefunds: async (status = "ALL") => {
    try {
      console.log(`Admin fetching seller refunds with status: ${status}`);
      const response = await api.get(`/api/refunds/admin/seller/${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin seller refunds:", error);
      throw error;
    }
  },

  getAdminAllRefunds: async (status = "ALL") => {
    try {
      console.log(`Admin fetching all refunds with status: ${status}`);
      const response = await api.get(`/api/refunds/admin/all/${status}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin all refunds:", error);
      throw error;
    }
  },

  adminAcceptRefund: async (refundId) => {
    try {
      console.log(`Admin accepting refund ${refundId}`);
      const response = await api.put(`/api/refunds/admin/accept/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error admin accepting refund:", error);
      throw error;
    }
  },

  adminRejectRefund: async (refundId) => {
    try {
      console.log(`Admin rejecting refund ${refundId}`);
      const response = await api.put(`/api/refunds/admin/reject/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error admin rejecting refund:", error);
      throw error;
    }
  },

  // Create payment URL for refund
  createRefundPayment: async (refundId) => {
    try {
      console.log(`Creating payment URL for refund ${refundId}`);
      const response = await api.post(`/api/refunds/payment/${refundId}`);
      return response.data;
    } catch (error) {
      console.error("Error creating refund payment:", error);
      throw error;
    }
  },

  // Handle payment callback
  handlePaymentCallback: async (refundId, params) => {
    try {
      console.log(`Handling payment callback for refund ${refundId}`);
      const response = await api.get(
        `/api/refunds/payment/callback/${refundId}`,
        {
          params: params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error handling payment callback:", error);
      throw error;
    }
  },
};

export default refundService;
