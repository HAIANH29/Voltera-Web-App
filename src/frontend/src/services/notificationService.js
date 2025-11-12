// src/services/notificationService.js
import api from '../config/api';

export const notificationService = {
  // Fetch all notifications for current user
  async getNotifications() {
    try {
      const response = await api.get('/api/notifications');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Unable to load notifications'
      };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Unable to mark notification as unread'
      };
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      await api.put('/api/notifications/read-all');
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Unable to mark notification as read'
      };
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await api.delete(`/api/notifications/${notificationId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Unable to delete notification'
      };
    }
  },

  // Helper functions for notification types
  getNotificationType(title, message) {
    const content = (title + ' ' + message).toLowerCase();
    
    if (content.includes('hợp đồng') || content.includes('contract')) {
      if (content.includes('ký') || content.includes('signed') || content.includes('được duyệt')) {
        return 'contract-signed';
      }
      if (content.includes('hủy') || content.includes('cancelled') || content.includes('từ chối')) {
        return 'contract-cancelled';
      }
      return 'contract';
    }
    
    if (content.includes('thanh toán') || content.includes('payment')) {
      if (content.includes('thành công') || content.includes('success')) {
        return 'payment-success';
      }
      if (content.includes('thất bại') || content.includes('failed') || content.includes('lỗi')) {
        return 'payment-failed';
      }
      return 'payment';
    }
    
    if (content.includes('transaction')) {
      if (content.includes('completed') || content.includes('done') || content.includes('successfully')) {
        return 'transaction-completed';
      }
      if (content.includes('failed') || content.includes('fail')) {
        return 'transaction-failed';
      }
      if (content.includes('pending') || content.includes('processing')) {
        return 'transaction-pending';
      }
      return 'transaction';
    }
    
    return 'general';
  },

  // Format notification date
  formatNotificationDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Get unread count
  getUnreadCount(notifications) {
    return notifications.filter(n => !n.readStatus).length;
  },

  // Filter notifications by type
  filterNotifications(notifications, filter) {
    if (!notifications) return [];
    
    switch (filter) {
      case 'all':
        return notifications;
      case 'unread':
        return notifications.filter(n => !n.readStatus);
      case 'contract':
        return notifications.filter(n => {
          const type = this.getNotificationType(n.title, n.message);
          return type.includes('contract');
        });
      case 'payment':
        return notifications.filter(n => {
          const type = this.getNotificationType(n.title, n.message);
          return type.includes('payment');
        });
      case 'transaction':
        return notifications.filter(n => {
          const type = this.getNotificationType(n.title, n.message);
          return type.includes('transaction');
        });
      default:
        return notifications;
    }
  },

  // Sample notifications for testing (remove in production)
  getSampleNotifications() {
    return [
      {
        id: 1,
        title: 'Hợp đồng được ký',
        message: 'Hợp đồng mua xe Tesla Model 3 của bạn đã được ký thành công.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        readStatus: false
      },
      {
        id: 2,
        title: 'Thanh toán thành công',
        message: 'Giao dịch thanh toán 500,000 VND đã được xử lý thành công.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        readStatus: false
      },
      {
        id: 3,
        title: 'Hợp đồng bị hủy',
        message: 'Hợp đồng mua xe BMW i3 đã bị hủy do người bán từ chối.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        readStatus: true
      },
      {
        id: 4,
        title: 'Thanh toán thất bại',
        message: 'Giao dịch thanh toán của bạn đã thất bại. Vui lòng kiểm tra lại thông tin.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        readStatus: true
      },
      {
        id: 5,
        title: 'Thông báo hệ thống',
        message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        readStatus: false
      }
    ];
  }
};

export default notificationService;
