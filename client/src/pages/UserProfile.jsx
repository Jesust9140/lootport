import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserProfile, updateUserProfile, getUserTransactions, mockSteamLogin, uploadProfilePicture, deleteUserAccount, changePassword } from "../api/profileAPI";
import { getUserInventory } from "../api/inventoryAPI";
import "../components/Styles/UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    location: '',
    profilePicture: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Check URL parameters for tab
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'inventory', 'transactions', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
    
    // Check if user is authenticated
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!userData || !token) {
      navigate('/auth');
      return;
    }
    
    loadUserProfile();
    loadTransactions();
    loadInventory();
  }, [searchParams, navigate]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data.profile);
      setEditForm({
        username: data.profile.user.username,
        bio: data.profile.user.bio || '',
        location: data.profile.user.location || '',
        profilePicture: data.profile.user.profilePicture
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      // Create fallback profile from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id) {
        const fallbackProfile = {
          user: {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            profilePicture: userData.profilePicture || 'https://via.placeholder.com/150?text=User',
            steamId: userData.steamId || null,
            steamProfileUrl: userData.steamProfileUrl || null,
            bio: userData.bio || '',
            location: userData.location || '',
            role: userData.role,
            joinDate: userData.joinDate || new Date().toISOString(),
          },
          stats: {
            totalPurchases: 0,
            totalSales: 0,
            totalSpent: 0,
            totalEarned: 0,
            inventoryValue: 0,
            itemsOwned: 0,
            netProfit: 0
          },
          inventory: [],
          recentTransactions: []
        };
        setProfile(fallbackProfile);
        setEditForm({
          username: userData.username,
          bio: userData.bio || '',
          location: userData.location || '',
          profilePicture: userData.profilePicture || 'https://via.placeholder.com/150?text=User'
        });
      } else {
        setError("Failed to load profile: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (type = null) => {
    try {
      const data = await getUserTransactions(type);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      const result = await updateUserProfile(editForm);
      setProfile(prev => ({
        ...prev,
        user: { ...prev.user, ...result.user }
      }));
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...userData, ...result.user }));
      
    } catch (error) {
      setError("Failed to update profile: " + error.message);
    }
  };

  const handleSteamLink = async () => {
    try {
      setError('');
      setSuccess('');
      
      const result = await mockSteamLogin();
      setSuccess('Steam account linked successfully!');
      loadUserProfile(); // Reload to get updated Steam data
    } catch (error) {
      setError("Failed to link Steam account: " + error.message);
    }
  };

  const handleProfilePictureUpload = async (imageUrl) => {
    try {
      setError('');
      setSuccess('');
      
      const result = await uploadProfilePicture(imageUrl);
      setProfile(prev => ({
        ...prev,
        user: { ...prev.user, profilePicture: result.profilePicture }
      }));
      setEditForm(prev => ({
        ...prev,
        profilePicture: result.profilePicture
      }));
      setSuccess('Profile picture updated successfully!');
    } catch (error) {
      setError("Failed to upload profile picture: " + error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (passwordForm.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError("Failed to change password: " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError('');
      setSuccess('');
      
      await deleteUserAccount();
      
      // Clear all user data and redirect
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      navigate('/', { replace: true });
    } catch (error) {
      setError("Failed to delete account: " + error.message);
    }
  };

  const filterTransactions = (type) => {
    setTransactionFilter(type);
    loadTransactions(type === 'all' ? null : type);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'overview' ? {} : { tab });
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <h2>Profile Not Found</h2>
        <button onClick={() => navigate('/')} className="btn-home">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Header */}
      <div className="profile-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>My Profile</h1>
      </div>

      {/* Messages */}
      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {/* Profile Overview */}
      <div className="profile-overview">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <img 
              src={profile.user.profilePicture} 
              alt="Profile" 
              className="profile-avatar"
            />
            <button 
              className="btn-upload-photo"
              onClick={() => {
                const newUrl = prompt('Enter image URL:', profile?.user?.profilePicture);
                if (newUrl && newUrl !== profile?.user?.profilePicture) {
                  handleProfilePictureUpload(newUrl);
                }
              }}
            >
              📷 Change Photo
            </button>
          </div>
          
          <div className="profile-info">
            <h2>{profile?.user?.username}</h2>
            <p className="profile-email">{profile?.user?.email}</p>
            <p className="profile-join-date">
              Member since {formatDate(profile?.user?.joinDate)}
            </p>
            
            {profile?.user?.bio && (
              <p className="profile-bio">{profile.user.bio}</p>
            )}
            
            {profile?.user?.location && (
              <p className="profile-location">📍 {profile.user.location}</p>
            )}

            <div className="profile-actions">
              <button 
                className="btn-edit-profile"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
              
              {!profile?.user?.steamId && (
                <button 
                  className="btn-steam-link"
                  onClick={handleSteamLink}
                >
                  🎮 Link Steam Account
                </button>
              )}
              
              {profile?.user?.steamId && (
                <a 
                  href={profile.user.steamProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-steam-profile"
                >
                  🎮 View Steam Profile
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(profile?.stats?.inventoryValue || 0)}</div>
            <div className="stat-label">Inventory Value</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profile?.stats?.itemsOwned || 0}</div>
            <div className="stat-label">Items Owned</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profile?.stats?.totalPurchases || 0}</div>
            <div className="stat-label">Total Purchases</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{profile?.stats?.totalSales || 0}</div>
            <div className="stat-label">Total Sales</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(profile?.stats?.netProfit || 0)}</div>
            <div className="stat-label">Net Profit</div>
            <div className={`stat-change ${(profile?.stats?.netProfit || 0) >= 0 ? 'positive' : 'negative'}`}>
              {(profile?.stats?.netProfit || 0) >= 0 ? '▲' : '▼'}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {editMode && (
        <div className="edit-profile-form">
          <h3>Edit Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                placeholder="City, Country"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)} className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => handleTabChange('inventory')}
        >
          My Inventory ({profile?.stats?.itemsOwned || 0})
        </button>
        <button 
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => handleTabChange('transactions')}
        >
          Transaction History
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabChange('settings')}
        >
          Account Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              {(profile?.recentTransactions?.length || 0) === 0 ? (
                <div className="empty-state">
                  <p>No recent transactions</p>
                </div>
              ) : (
                <div className="activity-list">
                  {profile.recentTransactions.map((transaction, index) => (
                    <div key={transaction._id || index} className="activity-item">
                      <img src={transaction.itemImage} alt={transaction.itemName} />
                      <div className="activity-info">
                        <h4>{transaction.itemName}</h4>
                        <p className={`activity-type ${transaction.type}`}>
                          {transaction.type === 'buy' ? 'Purchased' : 'Sold'}
                        </p>
                      </div>
                      <div className="activity-price">
                        {formatCurrency(transaction.price)}
                      </div>
                      <div className="activity-date">
                        {formatDate(transaction.transactionDate)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="inventory-tab">
            <h3>My Inventory</h3>
            {(inventory.length === 0) ? (
              <div className="empty-state">
                <div className="empty-icon">🎒</div>
                <p>No items in your inventory</p>
                <span>Items you own will appear here</span>
              </div>
            ) : (
              <div className="inventory-grid">
                {inventory.map((item, index) => (
                  <div key={item._id || index} className="inventory-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p className="item-condition">{item.condition}</p>
                      <p className="item-rarity">{item.rarity}</p>
                      <div className="item-price">{formatCurrency(item.price || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="transactions-tab">
            <div className="transaction-filters">
              <h3>Transaction History</h3>
              <div className="filter-buttons">
                <button 
                  className={transactionFilter === 'all' ? 'active' : ''}
                  onClick={() => filterTransactions('all')}
                >
                  All
                </button>
                <button 
                  className={transactionFilter === 'buy' ? 'active' : ''}
                  onClick={() => filterTransactions('buy')}
                >
                  Purchases
                </button>
                <button 
                  className={transactionFilter === 'sell' ? 'active' : ''}
                  onClick={() => filterTransactions('sell')}
                >
                  Sales
                </button>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>No transactions found</p>
                <span>Your transaction history will appear here</span>
              </div>
            ) : (
              <div className="transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="transaction-item">
                    <img src={transaction.itemImage} alt={transaction.itemName} />
                    <div className="transaction-info">
                      <h4>{transaction.itemName}</h4>
                      <p className="transaction-condition">{transaction.condition}</p>
                      <p className="transaction-rarity">{transaction.rarity}</p>
                    </div>
                    <div className={`transaction-type ${transaction.type}`}>
                      {transaction.type === 'buy' ? 'Purchase' : 'Sale'}
                    </div>
                    <div className="transaction-price">
                      {formatCurrency(transaction.price)}
                    </div>
                    <div className="transaction-date">
                      {formatDate(transaction.transactionDate)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h3>Account Settings</h3>
            
            {/* Password Change Section */}
            <div className="settings-section">
              <h4>Change Password</h4>
              <p>Update your account password for better security</p>
              
              {!showPasswordForm ? (
                <button 
                  className="btn-change-password"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      required
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      required
                      minLength={6}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      required
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save">Update Password</button>
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Deletion Section */}
            <div className="settings-section danger-section">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
              
              {!showDeleteConfirm ? (
                <button 
                  className="btn-delete-account"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete My Account
                </button>
              ) : (
                <div className="delete-confirmation">
                  <p><strong>Are you sure you want to delete your account?</strong></p>
                  <p>This will permanently remove:</p>
                  <ul>
                    <li>Your profile and personal information</li>
                    <li>Your inventory and transaction history</li>
                    <li>All notifications and preferences</li>
                  </ul>
                  
                  <div className="form-actions">
                    <button 
                      className="btn-confirm-delete"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
