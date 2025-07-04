import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../api/authAPI";
import { getUserNotifications } from "../api/notificationAPI";
import "../components/Styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userSkins, setUserSkins] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivity] = useState([]);
  const [stats] = useState({
    totalValue: 0,
    itemsOwned: 0,
    totalSales: 0,
    totalPurchases: 0
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = getStoredUser();
    if (userData) {
      setUser({
        username: userData.username,
        email: userData.email,
        joinDate: new Date(userData.joinDate).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })
      });
    }

    const loadUserSkins = async () => {
      try {
        // Start with empty skins - admin can add real data later
        setUserSkins([]);
      } catch (error) {
        console.error("Error loading user skins:", error);
      }
    };
    
    const loadNotifications = async () => {
      try {
        const notificationData = await getUserNotifications();
        setNotifications(notificationData.slice(0, 3)); // Show only first 3 in dashboard
      } catch (error) {
        console.error("Error loading notifications:", error);
        setNotifications([]);
      }
    };
    
    loadUserSkins();
    loadNotifications();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Back to Marketplace
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>${stats.totalValue.toFixed(2)}</h3>
            <p>Total Inventory Value</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>{stats.itemsOwned}</h3>
            <p>Items Owned</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{stats.totalSales}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <h3>{stats.totalPurchases}</h3>
            <p>Total Purchases</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* User Profile */}
        <div className="dashboard-card profile-card">
          <h2>Profile</h2>
          <div className="profile-info">
            <div className="profile-avatar">
              <img src="https://via.placeholder.com/80" alt="Profile" />
            </div>
            <div className="profile-details">
              <h3>{user?.username || "Loading..."}</h3>
              <p>{user?.email || "Loading..."}</p>
              <span className="join-date">Member since {user?.joinDate || "Loading..."}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn-primary">Edit Profile</button>
            <button className="btn-secondary">Settings</button>
          </div>
        </div>

        {/* My Inventory */}
        <div className="dashboard-card inventory-card">
          <h2>My Inventory</h2>
          <div className="inventory-grid">
            {userSkins.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎒</div>
                <p>No items in inventory</p>
                <span>Your skins will appear here when you add them</span>
              </div>
            ) : (
              userSkins.map((skin) => (
                <div key={skin._id} className="inventory-item">
                  <img src={skin.imageUrl} alt={skin.name} />
                  <div className="item-details">
                    <h4>{skin.name}</h4>
                    <p className="item-wear">{skin.wear}</p>
                    <span className="item-price">${skin.price.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="btn-view-all">View All Items</button>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>No recent activity yet</p>
                <span>Your transactions will appear here</span>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-info">
                    <span className={`activity-action ${activity.action.toLowerCase()}`}>
                      {activity.action}
                    </span>
                    <span className="activity-item-name">{activity.item}</span>
                  </div>
                  <div className="activity-details">
                    <span className="activity-price">${activity.price.toFixed(2)}</span>
                    <span className="activity-date">{activity.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="btn-view-all">View All Activity</button>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn sell-btn">
              <span className="action-icon">💵</span>
              <span>Sell Item</span>
            </button>
            <button className="action-btn buy-btn">
              <span className="action-icon">🛍️</span>
              <span>Browse Market</span>
            </button>
            <button className="action-btn trade-btn">
              <span className="action-icon">🔄</span>
              <span>Trade Items</span>
            </button>
            <button className="action-btn wishlist-btn">
              <span className="action-icon">⭐</span>
              <span>Wishlist</span>
            </button>
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="dashboard-card notifications-card">
          <h2>Recent Notifications</h2>
          <div className="dashboard-notifications">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔔</div>
                <p>No notifications yet</p>
                <span>Notifications will appear here</span>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification._id} className={`dashboard-notification-item ${notification.read ? 'read' : 'unread'}`}>
                  <div className="notification-icon">
                    {notification.type === 'sale' ? '💰' : 
                     notification.type === 'purchase' ? '🛒' : 
                     notification.type === 'system' ? '🆕' : '📢'}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {!notification.read && <div className="notification-status unread"></div>}
                </div>
              ))
            )}
          </div>
          <button className="btn-view-all">View All Notifications</button>
        </div>
      </div>
    </div>
  );
}
