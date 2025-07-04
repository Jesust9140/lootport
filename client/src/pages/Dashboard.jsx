import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSkins } from "../api/skinAPI";
import { getStoredUser } from "../api/authAPI";
import "../components/Styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userSkins, setUserSkins] = useState([]);
  const [recentActivity] = useState([
    { id: 1, action: "Bought", item: "AK-47 Redline", price: 45.99, date: "2 hours ago" },
    { id: 2, action: "Sold", item: "M4A4 Howl", price: 1299.99, date: "1 day ago" },
    { id: 3, action: "Listed", item: "AWP Dragon Lore", price: 2499.99, date: "3 days ago" }
  ]);
  const [stats] = useState({
    totalValue: 3847.52,
    itemsOwned: 23,
    totalSales: 12,
    totalPurchases: 35
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
        const data = await fetchSkins();
        // Simulate user's skins (first 6 items)
        setUserSkins(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching user skins:", error);
      }
    };
    loadUserSkins();
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
            {userSkins.map((skin) => (
              <div key={skin._id} className="inventory-item">
                <img src={skin.imageUrl} alt={skin.name} />
                <div className="item-details">
                  <h4>{skin.name}</h4>
                  <p className="item-wear">{skin.wear}</p>
                  <span className="item-price">${skin.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-view-all">View All Items</button>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity) => (
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
            ))}
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
            <div className="dashboard-notification-item sale">
              <div className="notification-icon">💰</div>
              <div className="notification-content">
                <h4>Item Sold!</h4>
                <p>Your AK-47 Redline has been sold for $45.99</p>
                <span className="notification-time">5 minutes ago</span>
              </div>
              <div className="notification-status unread"></div>
            </div>
            
            <div className="dashboard-notification-item news">
              <div className="notification-icon">🆕</div>
              <div className="notification-content">
                <h4>New Website Feature</h4>
                <p>Price tracking is now available for your favorite skins</p>
                <span className="notification-time">2 hours ago</span>
              </div>
              <div className="notification-status unread"></div>
            </div>
            
            <div className="dashboard-notification-item purchase read">
              <div className="notification-icon">🛒</div>
              <div className="notification-content">
                <h4>Purchase Confirmed</h4>
                <p>M4A4 Howl successfully purchased for $1,299.99</p>
                <span className="notification-time">1 day ago</span>
              </div>
            </div>
          </div>
          <button className="btn-view-all">View All Notifications</button>
        </div>
      </div>
    </div>
  );
}
