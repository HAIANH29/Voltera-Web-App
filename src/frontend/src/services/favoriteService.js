import api from "../config/api";
import Cookies from "js-cookie";

/**
 * Service for managing user favorites
 */
export const favoriteService = {
  /**
   * Add a post to favorites
   * @param {string} postId - The post ID to add to favorites
   * @returns {Promise} API response
   */
  addToFavorites: async (postId) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("User not logged in");
      }

      const response = await api.post(
        `/api/favorites/add/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Added to favorites:", postId);
      return response;
    } catch (error) {
      console.error("❌ Error adding to favorites:", error);
      throw error;
    }
  },

  /**
   * Remove a post from favorites
   * @param {string} postId - The post ID to remove from favorites
   * @returns {Promise} API response
   */
  removeFromFavorites: async (postId) => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("User not logged in");
      }

      const response = await api.delete(`/api/favorites/delete/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Removed from favorites:", postId);
      return response;
    } catch (error) {
      console.error("❌ Error removing from favorites:", error);
      throw error;
    }
  },

  /**
   * Get all user favorites
   * @returns {Promise} API response with favorites list
   */
  getFavorites: async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        throw new Error("User not logged in");
      }

      const response = await api.get("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Fetched favorites:", response.data?.length || 0);
      return response;
    } catch (error) {
      console.error("❌ Error fetching favorites:", error);
      throw error;
    }
  },

  /**
   * Check if user is logged in
   * @returns {boolean} Whether user has access token
   */
  isUserLoggedIn: () => {
    return !!Cookies.get("accessToken");
  },
};
