import InventoryItem from "../models/InventoryItem.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// @desc    Create a transaction for buying/selling skins
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { inventoryItemId, buyerId } = req.body;
    
    // Get the inventory item
    const inventoryItem = await InventoryItem.findById(inventoryItemId)
      .populate('owner', 'username email');
    
    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found"
      });
    }

    if (inventoryItem.status !== 'listed') {
      return res.status(400).json({
        success: false,
        message: "Item is not available for purchase"
      });
    }

    if (inventoryItem.owner._id.toString() === (buyerId || req.user.userId)) {
      return res.status(400).json({
        success: false,
        message: "Cannot buy your own item"
      });
    }

    // Create transaction
    const transaction = new Transaction({
      buyer: buyerId || req.user.userId,
      seller: inventoryItem.owner._id,
      inventoryItem: inventoryItemId,
      itemName: inventoryItem.itemName,
      itemImage: inventoryItem.imageUrl,
      salePrice: inventoryItem.listingPrice,
      condition: inventoryItem.wear,
      rarity: inventoryItem.rarity,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await transaction.save();

    // Update inventory item status
    inventoryItem.status = 'pending_trade';
    await inventoryItem.save();

    // Send notifications
    const buyer = await User.findById(buyerId || req.user.userId);
    const seller = await User.findById(inventoryItem.owner._id);

    await buyer.addNotification(
      "Purchase Initiated",
      `Your purchase of ${inventoryItem.itemName} for $${inventoryItem.listingPrice} is being processed.`,
      "sale"
    );

    await seller.addNotification(
      "Item Sale Pending",
      `Your ${inventoryItem.itemName} has been purchased for $${inventoryItem.listingPrice}.`,
      "sale"
    );

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction: {
        ...transaction.toObject(),
        buyer: { username: buyer.username },
        seller: { username: seller.username }
      }
    });

  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating transaction"
    });
  }
};

// @desc    Complete a transaction
// @route   PUT /api/transactions/:id/complete
// @access  Private (Admin or involved parties)
export const completeTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id)
      .populate('buyer', 'username email')
      .populate('seller', 'username email')
      .populate('inventoryItem');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // Check authorization
    const isAuthorized = req.user.role === 'admin' || 
                        transaction.buyer._id.toString() === req.user.userId ||
                        transaction.seller._id.toString() === req.user.userId;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this transaction"
      });
    }

    // Update transaction
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    // Update inventory item - transfer ownership
    const inventoryItem = transaction.inventoryItem;
    inventoryItem.owner = transaction.buyer._id;
    inventoryItem.status = 'in_inventory';
    inventoryItem.listingPrice = null;
    inventoryItem.listedAt = null;
    inventoryItem.soldAt = new Date();
    inventoryItem.soldPrice = transaction.salePrice;
    await inventoryItem.save();

    // Send completion notifications
    await transaction.buyer.addNotification(
      "Purchase Complete",
      `You have successfully purchased ${inventoryItem.itemName} for $${transaction.salePrice}.`,
      "sale"
    );

    await transaction.seller.addNotification(
      "Sale Complete",
      `Your ${inventoryItem.itemName} has been sold for $${transaction.sellerReceives} (after fees).`,
      "sale"
    );

    res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction
    });

  } catch (error) {
    console.error("Complete transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Server error completing transaction"
    });
  }
};

// @desc    Get user's transaction history
// @route   GET /api/transactions
// @access  Private
export const getUserTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { buyer: req.user.userId },
        { seller: req.user.userId }
      ]
    };

    if (type === 'purchases') {
      query = { buyer: req.user.userId };
    } else if (type === 'sales') {
      query = { seller: req.user.userId };
    }

    const transactions = await Transaction.find(query)
      .populate('buyer', 'username profilePicture')
      .populate('seller', 'username profilePicture')
      .populate('inventoryItem', 'itemName imageUrl rarity wear')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    // Calculate stats
    const stats = {
      totalPurchases: await Transaction.countDocuments({ buyer: req.user.userId, status: 'completed' }),
      totalSales: await Transaction.countDocuments({ seller: req.user.userId, status: 'completed' }),
      totalSpent: 0,
      totalEarned: 0
    };

    const completedPurchases = await Transaction.find({ 
      buyer: req.user.userId, 
      status: 'completed' 
    });
    const completedSales = await Transaction.find({ 
      seller: req.user.userId, 
      status: 'completed' 
    });

    stats.totalSpent = completedPurchases.reduce((sum, t) => sum + t.salePrice, 0);
    stats.totalEarned = completedSales.reduce((sum, t) => sum + t.sellerReceives, 0);

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: transactions.length,
        totalRecords: total
      },
      stats
    });

  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching transactions"
    });
  }
};

// @desc    Cancel a pending transaction
// @route   PUT /api/transactions/:id/cancel
// @access  Private
export const cancelTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "Cancelled by user" } = req.body;
    
    const transaction = await Transaction.findById(id)
      .populate('buyer', 'username')
      .populate('seller', 'username');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Only pending transactions can be cancelled"
      });
    }

    // Check authorization
    const isAuthorized = req.user.role === 'admin' || 
                        transaction.buyer._id.toString() === req.user.userId ||
                        transaction.seller._id.toString() === req.user.userId;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this transaction"
      });
    }

    // Update transaction
    transaction.status = 'cancelled';
    transaction.refundReason = reason;
    await transaction.save();

    // Update inventory item back to listed
    const inventoryItem = await InventoryItem.findById(transaction.inventoryItem);
    if (inventoryItem) {
      inventoryItem.status = 'listed';
      await inventoryItem.save();
    }

    res.status(200).json({
      success: true,
      message: "Transaction cancelled successfully",
      transaction
    });

  } catch (error) {
    console.error("Cancel transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Server error cancelling transaction"
    });
  }
};

// export {
//   createTransaction,
//   completeTransaction,
//   getUserTransactions,
//   cancelTransaction
// };
