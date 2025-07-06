import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../api/authAPI";
import "../components/Styles/AdminDashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalTransactions: 5896,
    totalRevenue: 89420.50,
    activeSkins: 3254,
    pendingWithdrawals: 12,
    dailyActiveUsers: 324
  });
  const [recentTransactions] = useState([
    { id: 1, user: "john_doe", item: "AK-47 Redline", amount: 24.99, status: "completed", time: "2 min ago" },
    { id: 2, user: "sarah_k", item: "M4A4 Howl", amount: 2399.99, status: "pending", time: "5 min ago" },
    { id: 3, user: "mike_gamer", item: "AWP Dragon Lore", amount: 8999.99, status: "completed", time: "8 min ago" },
    { id: 4, user: "alex_pro", item: "Karambit Doppler", amount: 1299.99, status: "completed", time: "12 min ago" }
  ]);
  const [recentUsers] = useState([
    { id: 1, username: "new_user_123", email: "user@email.com", joinDate: "Today", status: "active" },
    { id: 2, username: "cs2_trader", email: "trader@email.com", joinDate: "Yesterday", status: "active" },
    { id: 3, username: "skin_collector", email: "collector@email.com", joinDate: "2 days ago", status: "pending" }
  ]);
  const [systemAlerts] = useState([
    { id: 1, type: "warning", message: "12 pending withdrawals require review", time: "10 min ago" },
    { id: 2, type: "info", message: "Daily backup completed successfully", time: "1 hour ago" },
    { id: 3, type: "error", message: "Failed payment attempt detected", time: "2 hours ago" }
  ]);

  useEffect(() => {
    const userData = getStoredUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-info">
            <span>Welcome, {user?.username || 'Admin'}</span>
            <button className="btn-logout" onClick={() => navigate("/")}>
              Back to Site
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats">
        <div className="stat-card users">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <span className="stat-title">Total Users</span>
          </div>
          <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          <div className="stat-change positive">+127 this month</div>
        </div>
        
        <div className="stat-card transactions">
          <div className="stat-header">
            <span className="stat-icon">💳</span>
            <span className="stat-title">Transactions</span>
          </div>
          <div className="stat-value">{stats.totalTransactions.toLocaleString()}</div>
          <div className="stat-change positive">+89 today</div>
        </div>
        
        <div className="stat-card revenue">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-title">Total Revenue</span>
          </div>
          <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-change positive">+$2,340 today</div>
        </div>
        
        <div className="stat-card skins">
          <div className="stat-header">
            <span className="stat-icon">🎯</span>
            <span className="stat-title">Active Skins</span>
          </div>
          <div className="stat-value">{stats.activeSkins.toLocaleString()}</div>
          <div className="stat-change neutral">23 new listings</div>
        </div>
        
        <div className="stat-card withdrawals">
          <div className="stat-header">
            <span className="stat-icon">⚠️</span>
            <span className="stat-title">Pending Withdrawals</span>
          </div>
          <div className="stat-value">{stats.pendingWithdrawals}</div>
          <div className="stat-change negative">Requires attention</div>
        </div>
        
        <div className="stat-card active">
          <div className="stat-header">
            <span className="stat-icon">📊</span>
            <span className="stat-title">Daily Active Users</span>
          </div>
          <div className="stat-value">{stats.dailyActiveUsers}</div>
          <div className="stat-change positive">+15% vs yesterday</div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="admin-actions">
        <button className="action-btn primary">
          <span>👥</span> Manage Users
        </button>
        <button className="action-btn secondary">
          <span>🎯</span> Manage Skins
        </button>
        <button className="action-btn warning">
          <span>💳</span> Review Withdrawals
        </button>
        <button className="action-btn info">
          <span>📊</span> View Analytics
        </button>
        <button className="action-btn danger">
          <span>⚙️</span> System Settings
        </button>
      </div>

      {/* Content Grid */}
      <div className="admin-content">
        {/* Recent Transactions */}
        <div className="admin-panel">
          <div className="panel-header">
            <h3>Recent Transactions</h3>
            <button className="btn-view-all">View All</button>
          </div>
          <div className="transactions-list">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-user">{transaction.user}</div>
                  <div className="transaction-item-name">{transaction.item}</div>
                </div>
                <div className="transaction-amount">${transaction.amount}</div>
                <div className="transaction-status" style={{ color: getStatusColor(transaction.status) }}>
                  {transaction.status}
                </div>
                <div className="transaction-time">{transaction.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="admin-panel">
          <div className="panel-header">
            <h3>New Users</h3>
            <button className="btn-view-all">View All</button>
          </div>
          <div className="users-list">
            {recentUsers.map(user => (
              <div key={user.id} className="user-item">
                <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                <div className="user-info">
                  <div className="user-name">{user.username}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <div className="user-join-date">{user.joinDate}</div>
                <div className={`user-status ${user.status}`}>{user.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="admin-panel full-width">
          <div className="panel-header">
            <h3>System Alerts</h3>
            <button className="btn-view-all">Clear All</button>
          </div>
          <div className="alerts-list">
            {systemAlerts.map(alert => (
              <div key={alert.id} className="alert-item">
                <div className="alert-icon" style={{ color: getAlertColor(alert.type) }}>
                  {alert.type === 'error' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">{alert.time}</div>
                </div>
                <button className="alert-dismiss">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
