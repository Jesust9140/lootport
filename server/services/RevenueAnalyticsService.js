// Revenue tracking service for business analytics
// helps track the KPIs mentioned in our business strategy

import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export class RevenueAnalyticsService {
  
  // Calculate monthly revenue like skinport tracks
  static async getMonthlyRevenue(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const transactions = await Transaction.find({
      status: 'completed',
      completedAt: { $gte: startDate, $lte: endDate }
    });
    
    const metrics = {
      totalTransactions: transactions.length,
      grossMerchandiseVolume: transactions.reduce((sum, t) => sum + t.salePrice, 0),
      platformRevenue: transactions.reduce((sum, t) => sum + t.platformFee, 0),
      averageTransactionValue: 0,
      takeRate: 0
    };
    
    if (metrics.totalTransactions > 0) {
      metrics.averageTransactionValue = metrics.grossMerchandiseVolume / metrics.totalTransactions;
      metrics.takeRate = metrics.platformRevenue / metrics.grossMerchandiseVolume;
    }
    
    return metrics;
  }
  
  // Track user acquisition and retention like successful platforms do
  static async getUserGrowthMetrics(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // new users in last 30 days
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    // users who made transactions (activation rate)
    const activeUsers = await User.countDocuments({
      _id: { 
        $in: await Transaction.distinct('buyer', { 
          transactionDate: { $gte: startDate }
        })
      }
    });
    
    return {
      newUsers,
      activeUsers,
      activationRate: newUsers > 0 ? (activeUsers / newUsers) : 0
    };
  }
  
  // Calculate customer lifetime value - crucial for profitability
  static async getCustomerLTV(userId) {
    const userTransactions = await Transaction.find({
      $or: [{ buyer: userId }, { seller: userId }],
      status: 'completed'
    });
    
    const totalSpent = userTransactions
      .filter(t => t.buyer.toString() === userId.toString())
      .reduce((sum, t) => sum + t.salePrice, 0);
      
    const totalEarned = userTransactions
      .filter(t => t.seller.toString() === userId.toString())
      .reduce((sum, t) => sum + t.sellerReceives, 0);
      
    const platformFeesGenerated = userTransactions
      .reduce((sum, t) => sum + t.platformFee, 0);
    
    return {
      totalSpent,
      totalEarned,
      netVolume: totalSpent + totalEarned,
      platformFeesGenerated, // this is our actual revenue from this user
      transactionCount: userTransactions.length
    };
  }
  
  // Daily business dashboard metrics
  static async getDashboardMetrics() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    
    // today's metrics
    const todayTransactions = await Transaction.countDocuments({
      status: 'completed',
      completedAt: { $gte: yesterday, $lt: today }
    });
    
    const todayRevenue = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: yesterday, $lt: today }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$platformFee' },
          totalGMV: { $sum: '$salePrice' }
        }
      }
    ]);
    
    // total users and growth
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: yesterday, $lt: today }
    });
    
    return {
      todayTransactions,
      todayRevenue: todayRevenue[0]?.totalRevenue || 0,
      todayGMV: todayRevenue[0]?.totalGMV || 0,
      totalUsers,
      newUsersToday,
      // TODO: add more metrics like retention rate, churn, etc
    };
  }
  
  // Fraud detection metrics - important for sustainable growth
  static async getFraudMetrics(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const recentTransactions = await Transaction.find({
      transactionDate: { $gte: startDate }
    });
    
    // basic fraud indicators (should be more sophisticated)
    const suspiciousTransactions = recentTransactions.filter(t => {
      // flag unusually high value transactions
      return t.salePrice > 1000;
    });
    
    const chargebackCount = await Transaction.countDocuments({
      status: 'refunded',
      refundReason: { $regex: /chargeback|dispute/i },
      refundedAt: { $gte: startDate }
    });
    
    return {
      totalTransactions: recentTransactions.length,
      suspiciousTransactions: suspiciousTransactions.length,
      chargebackCount,
      fraudRate: recentTransactions.length > 0 ? 
        (suspiciousTransactions.length / recentTransactions.length) : 0
    };
  }
}

// TODO: add real-time alerting for important business events
// like when daily revenue hits targets, fraud spikes, etc
