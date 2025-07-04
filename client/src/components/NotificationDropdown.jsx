import React, { useState, useEffect, useRef } from "react";
import { getMockNotifications } from "../api/notificationAPI";
import "./NotificationDropdown.css";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications on component mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Using mock data for now - replace with real API when backend is ready
      const data = getMockNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      // Update local state immediately for better UX
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
      
      // Call API to mark as read (when backend is ready)
      // await markNotificationAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert local state if API call fails
      loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state immediately
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      
      // Call API to mark all as read (when backend is ready)
      // await markAllNotificationsAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Revert local state if API call fails
      loadNotifications();
    }
  };

  const deleteNotificationHandler = async (id) => {
    try {
      // Update local state immediately
      setNotifications(notifications.filter(notification => notification.id !== id));
      
      // Call API to delete notification (when backend is ready)
      // await deleteNotification(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
      // Revert local state if API call fails
      loadNotifications();
    }
  };

  const getNotificationTypeClass = (type) => {
    switch (type) {
      case "sale": return "notification-sale";
      case "purchase": return "notification-purchase";
      case "listing": return "notification-listing";
      case "news": return "notification-news";
      default: return "notification-default";
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button 
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <span>Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="no-notifications-icon">📭</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} ${getNotificationTypeClass(notification.type)}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-main">
                      <span className="notification-emoji">{notification.icon}</span>
                      <div className="notification-text">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                    <button
                      className="notification-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotificationHandler(notification.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  {!notification.read && <div className="unread-indicator"></div>}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button className="view-all-notifications">
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
