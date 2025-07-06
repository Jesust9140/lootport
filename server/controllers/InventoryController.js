import mongoose from "mongoose";
import InventoryItem from "../models/InventoryItem.js";
import User from "../models/User.js";

// TODO: implement Steam inventory syncing instead of manual adding
// also need to add inventory caching to reduce database calls

// @desc    Get user's inventory
// @route   GET /api/inventory
// @access  Private
export const getUserInventory = async (req, res) => {
  try {
    const inventory = await InventoryItem.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });

    // should probably paginate this for users with large inventories
    const stats = {
      total: inventory.length,
      listed: inventory.filter(item => item.status === 'listed').length,
      sold: inventory.filter(item => item.status === 'sold').length,
      totalValue: inventory.reduce((sum, item) => sum + (item.listingPrice || item.steamMarketPrice || 0), 0)
    };

    res.status(200).json({
      success: true,
      inventory,
      stats
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching inventory",
    });
  }
};

// this is mainly for testing, real items should come from Steam API
// @desc    Add item to inventory manually (for testing)
// @route   POST /api/inventory
// @access  Private
export const addInventoryItem = async (req, res) => {
  try {
    const {
      steamId,
      itemName,
      skinName,
      rarity,
      wear,
      floatValue,
      imageUrl,
      steamMarketPrice,
      inspectLink,
      stickers,
      tags
    } = req.body;

    const inventoryItem = await InventoryItem.create({
      owner: req.user.userId,
      steamId,
      itemName,
      skinName,
      rarity,
      wear,
      floatValue,
      imageUrl,
      steamMarketPrice,
      inspectLink,
      stickers: stickers || [],
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: "Item added to inventory",
      item: inventoryItem
    });
  } catch (error) {
    console.error("Add inventory item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding item to inventory",
    });
  }
};

// @desc    List item for sale
// @route   PUT /api/inventory/:id/list
// @access  Private
export const listItemForSale = async (req, res) => {
  try {
    const { listingPrice } = req.body;
    const itemId = req.params.id;

    const item = await InventoryItem.findOne({
      _id: itemId,
      owner: req.user.userId
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in your inventory"
      });
    }

    if (item.status === 'listed') {
      return res.status(400).json({
        success: false,
        message: "Item is already listed for sale"
      });
    }

    item.listingPrice = listingPrice;
    item.status = 'listed';
    item.listedAt = new Date();
    await item.save();

    res.status(200).json({
      success: true,
      message: "Item listed for sale",
      item
    });
  } catch (error) {
    console.error("List item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error listing item",
    });
  }
};

// @desc    Update listing price
// @route   PUT /api/inventory/:id
// @access  Private
export const updateListingPrice = async (req, res) => {
  try {
    const { listingPrice } = req.body;
    const itemId = req.params.id;

    const item = await InventoryItem.findOne({
      _id: itemId,
      owner: req.user.userId,
      status: 'listed'
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Listed item not found"
      });
    }

    item.listingPrice = listingPrice;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Listing price updated",
      item
    });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating listing",
    });
  }
};

// @desc    Remove item from sale (unlist)
// @route   DELETE /api/inventory/:id/unlist
// @access  Private
export const unlistItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await InventoryItem.findOne({
      _id: itemId,
      owner: req.user.userId,
      status: 'listed'
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Listed item not found"
      });
    }

    item.status = 'in_inventory';
    item.listingPrice = null;
    item.listedAt = null;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Item removed from sale",
      item
    });
  } catch (error) {
    console.error("Unlist item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error unlisting item",
    });
  }
};

// @desc    Mark item as sold (admin only)
// @route   PUT /api/inventory/:id/sold
// @access  Private (Admin only)
export const markItemSold = async (req, res) => {
  try {
    const { soldPrice, buyerId } = req.body;
    const itemId = req.params.id;

    // Check if user is admin
    const adminUser = await User.findById(req.user.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    const item = await InventoryItem.findOne({
      _id: itemId,
      status: 'listed'
    }).populate('owner');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Listed item not found"
      });
    }

    item.status = 'sold';
    item.soldPrice = soldPrice;
    item.soldAt = new Date();
    if (buyerId) {
      item.buyerId = buyerId;
    }
    await item.save();

    // Send notification to seller
    await item.owner.addNotification(
      "🎉 Your Skin Sold!",
      `Congratulations! Your ${item.itemName} | ${item.skinName} has been sold for $${soldPrice}. The payment will be processed shortly.`,
      "skin_sold"
    );

    res.status(200).json({
      success: true,
      message: "Item marked as sold and notification sent",
      item
    });
  } catch (error) {
    console.error("Mark sold error:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking item as sold",
    });
  }
};

// @desc    Get all listed items (marketplace)
// @route   GET /api/inventory/marketplace
// @access  Public
export const getMarketplace = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      rarity, 
      wear, 
      minPrice, 
      maxPrice, 
      search 
    } = req.query;

    const query = { status: 'listed' };
    
    // Add filters
    if (rarity) query.rarity = rarity;
    if (wear) query.wear = wear;
    if (minPrice || maxPrice) {
      query.listingPrice = {};
      if (minPrice) query.listingPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.listingPrice.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { skinName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const items = await InventoryItem.find(query)
      .populate('owner', 'username')
      .sort({ listedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InventoryItem.countDocuments(query);

    res.status(200).json({
      success: true,
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get marketplace error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching marketplace",
    });
  }
};

// @desc    Get filtered and sorted inventory with advanced options
// @route   GET /api/inventory/advanced
// @access  Private
export const getAdvancedInventory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      rarity,
      wear,
      status,
      minPrice,
      maxPrice,
      search
    } = req.query;

    const skip = (page - 1) * limit;
    let query = { owner: req.user.userId };

    // Apply filters
    if (rarity) query.rarity = rarity;
    if (wear) query.wear = wear;
    if (status) query.status = status;
    
    if (minPrice || maxPrice) {
      query.$or = [];
      if (minPrice) query.$or.push({ listingPrice: { $gte: parseFloat(minPrice) } });
      if (maxPrice) query.$or.push({ listingPrice: { $lte: parseFloat(maxPrice) } });
      if (minPrice) query.$or.push({ steamMarketPrice: { $gte: parseFloat(minPrice) } });
      if (maxPrice) query.$or.push({ steamMarketPrice: { $lte: parseFloat(maxPrice) } });
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const inventory = await InventoryItem.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await InventoryItem.countDocuments(query);

    // Calculate detailed stats
    const allItems = await InventoryItem.find({ owner: req.user.userId });
    const stats = {
      total: allItems.length,
      byStatus: {
        in_inventory: allItems.filter(item => item.status === 'in_inventory').length,
        listed: allItems.filter(item => item.status === 'listed').length,
        sold: allItems.filter(item => item.status === 'sold').length,
        pending_trade: allItems.filter(item => item.status === 'pending_trade').length
      },
      byRarity: {},
      byWear: {},
      totalValue: allItems.reduce((sum, item) => sum + (item.listingPrice || item.steamMarketPrice || 0), 0),
      listedValue: allItems.filter(item => item.status === 'listed').reduce((sum, item) => sum + (item.listingPrice || 0), 0)
    };

    // Calculate rarity and wear distributions
    allItems.forEach(item => {
      stats.byRarity[item.rarity] = (stats.byRarity[item.rarity] || 0) + 1;
      stats.byWear[item.wear] = (stats.byWear[item.wear] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      inventory,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: inventory.length,
        totalRecords: total
      },
      stats,
      filters: { rarity, wear, status, minPrice, maxPrice, search }
    });

  } catch (error) {
    console.error("Get advanced inventory error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching inventory"
    });
  }
};

// @desc    Bulk update inventory items
// @route   PUT /api/inventory/bulk
// @access  Private
export const bulkUpdateInventory = async (req, res) => {
  try {
    const { itemIds, action, data } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Item IDs array is required"
      });
    }

    const items = await InventoryItem.find({
      _id: { $in: itemIds },
      owner: req.user.userId
    });

    if (items.length !== itemIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some items not found in your inventory"
      });
    }

    let updateQuery = {};
    let message = "";

    switch (action) {
      case 'list':
        if (!data.listingPrice) {
          return res.status(400).json({
            success: false,
            message: "Listing price is required for bulk listing"
          });
        }
        updateQuery = {
          status: 'listed',
          listingPrice: data.listingPrice,
          listedAt: new Date()
        };
        message = `${itemIds.length} items listed for sale`;
        break;

      case 'unlist':
        updateQuery = {
          status: 'in_inventory',
          listingPrice: null,
          listedAt: null
        };
        message = `${itemIds.length} items unlisted`;
        break;

      case 'update_price':
        if (!data.listingPrice) {
          return res.status(400).json({
            success: false,
            message: "New listing price is required"
          });
        }
        updateQuery = { listingPrice: data.listingPrice };
        message = `${itemIds.length} items price updated`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid bulk action"
        });
    }

    await InventoryItem.updateMany(
      { _id: { $in: itemIds }, owner: req.user.userId },
      updateQuery
    );

    // Send notification
    const user = await User.findById(req.user.userId);
    await user.addNotification(
      "Bulk Update Complete",
      message,
      "system"
    );

    res.status(200).json({
      success: true,
      message,
      updatedCount: itemIds.length
    });

  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating items"
    });
  }
};

// @desc    Get inventory value analytics
// @route   GET /api/inventory/analytics
// @access  Private
export const getInventoryAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const inventory = await InventoryItem.find({ owner: req.user.userId });
    
    // Get transactions for profit/loss calculation
    const Transaction = mongoose.model('Transaction');
    const purchases = await Transaction.find({
      buyer: req.user.userId,
      status: 'completed',
      createdAt: { $gte: startDate }
    });
    
    const sales = await Transaction.find({
      seller: req.user.userId,
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const analytics = {
      inventory: {
        totalItems: inventory.length,
        totalValue: inventory.reduce((sum, item) => sum + (item.listingPrice || item.steamMarketPrice || 0), 0),
        listedItems: inventory.filter(item => item.status === 'listed').length,
        listedValue: inventory.filter(item => item.status === 'listed').reduce((sum, item) => sum + (item.listingPrice || 0), 0)
      },
      trading: {
        totalPurchases: purchases.length,
        totalSpent: purchases.reduce((sum, t) => sum + t.salePrice, 0),
        totalSales: sales.length,
        totalEarned: sales.reduce((sum, t) => sum + t.sellerReceives, 0)
      },
      profitLoss: {
        gross: sales.reduce((sum, t) => sum + t.sellerReceives, 0) - purchases.reduce((sum, t) => sum + t.salePrice, 0),
        fees: sales.reduce((sum, t) => sum + t.platformFee, 0)
      },
      trends: {
        // This could be expanded with daily/weekly breakdowns
        period,
        startDate,
        endDate: now
      }
    };

    analytics.profitLoss.net = analytics.profitLoss.gross - analytics.profitLoss.fees;

    res.status(200).json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching analytics"
    });
  }
};
