import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import { routes } from '../../routes';
import './NotificationBell.css';

const NotificationBell = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);

  // Fetch notifications count
  const fetchNotifications = async () => {
    const result = await notificationService.getNotifications();
    if (result.success) {
      const notifications = result.data;
      setUnreadCount(notificationService.getUnreadCount(notifications));
      // Show only first 5 recent notifications in dropdown
      setRecentNotifications(notifications.slice(0, 5));
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    if (showDropdown) {
      navigate(routes.notifications);
    }
    setShowDropdown(!showDropdown);
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.readStatus) {
      await notificationService.markAsRead(notification.id);
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    setShowDropdown(false);
    navigate(routes.notifications);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contract-signed':
        return '✅';
      case 'contract-cancelled':
        return '❌';
      case 'payment-success':
        return '💰';
      case 'payment-failed':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="notification-bell-container">
      <button 
        className="notification-bell" 
        onClick={handleBellClick}
        title="Notifications"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="notification-overlay" onClick={() => setShowDropdown(false)} />
          <div className="notification-dropdown">
            <div className="notification-header">
              <h4>Notifications</h4>
              {unreadCount > 0 && (
                <span className="unread-count">{unreadCount} unread</span>
              )}
            </div>

            <div className="notification-list">
              {recentNotifications.length === 0 ? (
                <div className="no-notifications">
                  <p>No notifications</p>
                </div>
              ) : (
                recentNotifications.map((notification) => {
                  const type = notificationService.getNotificationType(notification.title, notification.message);
                  
                  return (
                    <div 
                      key={notification.id}
                      className={`notification-item ${!notification.readStatus ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(type)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">
                          {notification.title}
                        </div>
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {notificationService.formatNotificationDate(notification.createdAt)}
                        </div>
                      </div>
                      {!notification.readStatus && (
                        <div className="unread-indicator"></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="notification-footer">
              <button 
                className="view-all-btn"
                onClick={() => {
                  setShowDropdown(false);
                  navigate(routes.notifications);
                }}
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
export { NotificationBell };