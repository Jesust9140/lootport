import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserNotifications } from "../api/notificationAPI";
import { getUserInventory } from "../api/inventoryAPI";
import { getSteamProfile, importSteamInventory } from "../api/steamAPI";
import "../components/Styles/Dashboard.css";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [steamProfile, setSteamProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");
    
    if (!userData || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load notifications
    loadNotifications();
    loadInventory();
    loadSteamProfile();
  }, [navigate]);

  const loadNotifications = async () => {
    try {
      const data = await getUserNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const loadInventory = async () => {
    try {
      const data = await getUserInventory();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  };

  const loadSteamProfile = async () => {
    try {
      const data = await getSteamProfile();
      setSteamProfile(data.steamAccount);
    } catch (error) {
      console.error("No Steam profile found:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportInventory = async () => {
    setInventoryLoading(true);
    try {
      const result = await importSteamInventory();
      alert(`Successfully imported ${result.importedItems?.length || 0} items!`);
      loadInventory(); // Refresh inventory
      loadNotifications(); // Refresh notifications
    } catch (error) {
      alert(`Failed to import inventory: ${error.message}`);
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'skin_sold': return '🎉';
      case 'website_update': return '📢';
      case 'system': return 'ℹ️';
      default: return '📩';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="profile-section">
        <h2>Your Profile</h2>
        <div className="profile-info">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Account Type:</strong> Customer</p>
          <p><strong>Member Since:</strong> {new Date(user?.joinDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="notifications-section">
        <h2>Your Notifications</h2>
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet. You'll receive updates about:</p>
            <ul>
              <li>🎉 When your skins are sold</li>
              <li>📢 Website updates and new features</li>
              <li>💰 Market updates and opportunities</li>
            </ul>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="inventory-section">
        <h2>Your Inventory</h2>
        {steamProfile ? (
          <div className="steam-connected">
            <div className="steam-info">
              <img src={steamProfile.avatar} alt="Steam Avatar" className="steam-avatar" />
              <div>
                <h4>{steamProfile.displayName}</h4>
                <p>Steam Account: {steamProfile.isVerified ? '✅ Verified' : '❌ Not Verified'}</p>
                <p>Last Sync: {steamProfile.lastSync ? new Date(steamProfile.lastSync).toLocaleString() : 'Never'}</p>
              </div>
            </div>
            
            {steamProfile.isVerified && (
              <button 
                onClick={handleImportInventory} 
                disabled={inventoryLoading}
                className="import-btn"
              >
                {inventoryLoading ? "Importing..." : "Import CS2 Inventory"}
              </button>
            )}
            
            {inventory.length > 0 && (
              <div className="inventory-grid">
                {inventory.map((item) => (
                  <div key={item._id} className="inventory-item">
                    <img src={item.imageUrl} alt={`${item.itemName} | ${item.skinName}`} />
                    <div className="item-info">
                      <h5>{item.itemName}</h5>
                      <p>{item.skinName}</p>
                      <p className={`rarity ${item.rarity.toLowerCase().replace(' ', '-')}`}>
                        {item.rarity}
                      </p>
                      <p className="wear">{item.wear}</p>
                      <p className="price">${item.steamMarketPrice}</p>
                      <p className={`status ${item.status}`}>{item.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="steam-not-connected">
            <p>🚧 Connect your Steam account to import your CS2 inventory!</p>
            <p>Features coming soon:</p>
            <ul>
              <li>Connect Steam account</li>
              <li>Import CS2 skins automatically</li>
              <li>List skins for sale</li>
              <li>Track sales and earnings</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
