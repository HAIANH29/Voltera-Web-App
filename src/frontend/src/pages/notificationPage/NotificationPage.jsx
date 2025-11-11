import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import './NotificationPage.css';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, contract, payment
  const [error, setError] = useState(null);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationService.getNotifications();
      if (result.success) {
        setNotifications(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const result = await notificationService.markAsRead(notificationId);
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, readStatus: true }
            : notif
        )
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const result = await notificationService.markAllAsRead();
    if (result.success) {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, readStatus: true }))
      );
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    const result = await notificationService.deleteNotification(notificationId);
    if (result.success) {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    }
  };

  // Get notification type from title/message
  const getNotificationType = (title, message) => {
    return notificationService.getNotificationType(title, message);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'contract-signed':
        return (
          <svg className="notification-icon contract-signed" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17l-3.59-3.58L4 14l5 5 11-11-1.41-1.41L9 16.17z"/>
            <path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z" opacity="0.3"/>
          </svg>
        );
      case 'contract-cancelled':
        return (
          <svg className="notification-icon contract-cancelled" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            <path d="M19 3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z" opacity="0.3"/>
          </svg>
        );
      case 'payment-success':
        return (
          <svg className="notification-icon payment-success" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'payment-failed':
        return (
          <svg className="notification-icon payment-failed" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
      default:
        return (
          <svg className="notification-icon general" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        );
    }
  };

  // Filter notifications
  const filteredNotifications = notificationService.filterNotifications(notifications, filter);

  // Format date
  const formatDate = (dateString) => {
    return notificationService.formatNotificationDate(dateString);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notificationService.getUnreadCount(notifications);

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="loading-header">
            <div className="loading-title"></div>
            <div className="loading-subtitle"></div>
          </div>
          <div className="loading-notifications">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="loading-notification">
                <div className="loading-icon"></div>
                <div className="loading-content">
                  <div className="loading-line"></div>
                  <div className="loading-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="error-state">
            <svg className="error-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3>An error occurred</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchNotifications}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Header */}
        <div className="notifications-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
            <div className="header-title">
              <h1>Notifications</h1>
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount} unread</span>
              )}
            </div>
          </div>
          
          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                </svg>
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="notifications-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'contract' ? 'active' : ''}`}
            onClick={() => setFilter('contract')}
          >
            Contracts
          </button>
          <button 
            className={`filter-btn ${filter === 'payment' ? 'active' : ''}`}
            onClick={() => setFilter('payment')}
          >
            Payments
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              <h3>No notifications</h3>
              <p>
                {filter === 'all' 
                  ? 'You have no notifications yet.'
                  : filter === 'unread'
                  ? 'You have read all notifications.'
                  : filter === 'contract'
                  ? 'No contract notifications.'
                  : 'No payment notifications.'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const type = getNotificationType(notification.title, notification.message);
              
              return (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.readStatus ? 'unread' : ''} ${type}`}
                  onClick={() => !notification.readStatus && markAsRead(notification.id)}
                >
                  <div className="notification-icon-container">
                    {getNotificationIcon(type)}
                    {!notification.readStatus && <div className="unread-indicator"></div>}
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3 className="notification-title">{notification.title}</h3>
                      <span className="notification-time">{formatDate(notification.createdAt)}</span>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                  
                  <div className="notification-actions">
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Delete notification"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
