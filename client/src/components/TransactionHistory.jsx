import React, { useState } from 'react';
import { 
  getUserTransactions, 
  completeTransaction, 
  cancelTransaction,
  formatPrice 
} from '../api/inventoryAPI';
import { useFilters, useAsyncOperation, useSelection } from '../hooks/useFilters';
import { handleApiError, showSuccessMessage } from '../utils/apiUtils';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const {
    filters,
    setFilter
  } = useFilters({
    type: 'all', // all, purchases, sales
    page: 1,
    limit: 20
  });

  const {
    data: transactionData,
    loading,
    error,
    execute: loadTransactions,
    clearError
  } = useAsyncOperation(
    () => getUserTransactions(filters),
    [filters]
  );

  const {
    selectedItems: actionLoading,
    selectItem: setActionLoading,
    clearSelection: clearActionLoading
  } = useSelection();

  const transactions = transactionData?.transactions || [];
  const stats = transactionData?.stats || {};
  const pagination = transactionData?.pagination || {};

  const handleCompleteTransaction = async (transactionId) => {
    try {
      setActionLoading(transactionId);
      await completeTransaction(transactionId);
      showSuccessMessage('Transaction completed successfully');
      loadTransactions(); // Refresh transactions
    } catch (err) {
      handleApiError(err, 'Failed to complete transaction');
    } finally {
      clearActionLoading();
    }
  };

  const handleCancelTransaction = async (transactionId, reason = '') => {
    try {
      setActionLoading(transactionId);
      await cancelTransaction(transactionId, reason);
      showSuccessMessage('Transaction cancelled successfully');
      loadTransactions(); // Refresh transactions
    } catch (err) {
      handleApiError(err, 'Failed to cancel transaction');
    } finally {
      clearActionLoading();
    }
  };

  if (loading) {
    return (
      <div className="transaction-history">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading transaction history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        <div className="transaction-stats">
          <div className="stat-card">
            <h3>{stats.totalPurchases || 0}</h3>
            <p>Purchases</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalSales || 0}</h3>
            <p>Sales</p>
          </div>
          <div className="stat-card">
            <h3>{formatPrice(stats.totalSpent || 0)}</h3>
            <p>Total Spent</p>
          </div>
          <div className="stat-card">
            <h3>{formatPrice(stats.totalEarned || 0)}</h3>
            <p>Total Earned</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={clearError} className="btn btn-icon">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="transaction-filters">
        <div className="filter-tabs">
          <button
            className={`btn btn-secondary ${filters.type === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('type', 'all')}
          >
            All Transactions
          </button>
          <button
            className={`btn btn-secondary ${filters.type === 'purchases' ? 'active' : ''}`}
            onClick={() => setFilter('type', 'purchases')}
          >
            Purchases
          </button>
          <button
            className={`btn btn-secondary ${filters.type === 'sales' ? 'active' : ''}`}
            onClick={() => setFilter('type', 'sales')}
          >
            Sales
          </button>
        </div>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="no-transactions">
          <h3>No transactions found</h3>
          <p>Your transaction history will appear here once you start trading</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction._id}
              transaction={transaction}
              onComplete={() => handleCompleteTransaction(transaction._id)}
              onCancel={(reason) => handleCancelTransaction(transaction._id, reason)}
              loading={actionLoading.includes(transaction._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="pagination">
          <button
            onClick={() => setFilter('page', pagination.current - 1)}
            disabled={pagination.current === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {pagination.current} of {pagination.total}
          </span>
          
          <button
            onClick={() => setFilter('page', pagination.current + 1)}
            disabled={pagination.current === pagination.total}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Individual transaction component
const TransactionItem = ({ transaction, onComplete, onCancel, loading }) => {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
  // Get current user from localStorage (you might want to use context instead)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isBuyer = transaction.buyer?._id === currentUser.id;
  const isSeller = transaction.seller?._id === currentUser.id;
  
  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'completed': '#22c55e',
      'cancelled': '#ef4444',
      'failed': '#ef4444',
      'refunded': '#8b5cf6'
    };
    return colors[status] || '#64748b';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    onCancel(cancelReason);
    setShowCancelForm(false);
    setCancelReason('');
  };

  return (
    <div className="transaction-item">
      <div className="transaction-main">
        <div className="item-info">
          <img 
            src={transaction.itemImage} 
            alt={transaction.itemName}
            className="item-image"
          />
          <div className="item-details">
            <h3 className="item-name">{transaction.itemName}</h3>
            <div className="item-meta">
              <span className="condition">{transaction.condition}</span>
              <span className="rarity">{transaction.rarity}</span>
            </div>
            <div className="transaction-id">
              ID: {transaction.transactionId}
            </div>
          </div>
        </div>

        <div className="transaction-details">
          <div className="price-info">
            <span className="price">{formatPrice(transaction.salePrice)}</span>
            {transaction.platformFee > 0 && (
              <span className="fee">
                Fee: {formatPrice(transaction.platformFee)}
              </span>
            )}
            {isSeller && transaction.sellerReceives && (
              <span className="received">
                You receive: {formatPrice(transaction.sellerReceives)}
              </span>
            )}
          </div>

          <div className="participants">
            <div className="participant">
              <span className="label">Buyer:</span>
              <span className="name">{transaction.buyer?.username || 'Unknown'}</span>
            </div>
            <div className="participant">
              <span className="label">Seller:</span>
              <span className="name">{transaction.seller?.username || 'Unknown'}</span>
            </div>
          </div>

          <div className="transaction-meta">
            <span 
              className="status"
              style={{ color: getStatusColor(transaction.status) }}
            >
              {transaction.status.toUpperCase()}
            </span>
            <span className="date">
              {formatDate(transaction.transactionDate)}
            </span>
          </div>
        </div>

        <div className="transaction-actions">
          {transaction.status === 'pending' && (
            <>
              {(isBuyer || isSeller || currentUser.role === 'admin') && (
                <button
                  onClick={onComplete}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Processing...' : 'Complete'}
                </button>
              )}
              
              {(isBuyer || isSeller || currentUser.role === 'admin') && (
                <button
                  onClick={() => setShowCancelForm(!showCancelForm)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              )}
            </>
          )}
          
          {transaction.status === 'completed' && transaction.completedAt && (
            <div className="completion-info">
              <span className="completed-label">Completed</span>
              <span className="completed-date">
                {formatDate(transaction.completedAt)}
              </span>
            </div>
          )}
          
          {transaction.status === 'cancelled' && transaction.refundReason && (
            <div className="cancellation-info">
              <span className="cancelled-label">Cancelled</span>
              <span className="cancel-reason">{transaction.refundReason}</span>
            </div>
          )}
        </div>
      </div>

      {showCancelForm && (
        <form onSubmit={handleCancelSubmit} className="cancel-form">
          <textarea
            placeholder="Reason for cancellation (optional)..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="form-input"
            rows="3"
          />
          <div className="cancel-actions">
            <button type="submit" className="btn btn-danger">
              Confirm Cancel
            </button>
            <button 
              type="button" 
              onClick={() => setShowCancelForm(false)}
              className="btn btn-secondary"
            >
              Nevermind
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TransactionHistory;
