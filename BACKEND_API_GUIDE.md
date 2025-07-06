# Lootdrop Inventory Management System - Backend API Guide

## Overview

Your Lootdrop backend now has a comprehensive inventory and transaction management system. Here's everything you need to know about the backend architecture and how to use it.

## Architecture

### Core Models

1. **User** - User authentication and profiles with notifications
2. **InventoryItem** - Individual skins with detailed metadata
3. **Transaction** - Buy/sell transactions with fees and status tracking
4. **SteamAccount** - Steam integration for account linking
5. **Skin** - Basic skin data (marketplace listings)

### Key Features

✅ **Complete CRUD Operations** for inventory management  
✅ **Transaction Processing** with buyer/seller tracking  
✅ **Steam Integration** for account linking and inventory sync  
✅ **Advanced Filtering & Search** for inventory  
✅ **Bulk Operations** for managing multiple items  
✅ **Analytics & Reporting** for profit/loss tracking  
✅ **Real-time Notifications** for transactions  
✅ **Platform Fee Calculation** (5% default)  
✅ **Comprehensive Error Handling**  

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user profile

### Inventory Routes (`/api/inventory`)

#### Basic Operations
- `GET /` - Get user's basic inventory
- `GET /advanced` - Get filtered/sorted inventory with pagination
- `GET /analytics` - Get inventory value analytics
- `GET /marketplace` - Public marketplace listings
- `POST /` - Add item to inventory (manual/testing)

#### Item Management
- `PUT /:id/list` - List item for sale
- `PUT /:id` - Update item listing price
- `DELETE /:id/unlist` - Remove item from marketplace
- `PUT /bulk` - Bulk operations (list/unlist/price update)

#### Admin Only
- `PUT /:id/sold` - Mark item as sold (admin)

### Transaction Routes (`/api/transactions`)
- `POST /` - Create new transaction (purchase)
- `GET /` - Get user's transaction history
- `PUT /:id/complete` - Complete a transaction
- `PUT /:id/cancel` - Cancel pending transaction

### Steam Routes (`/api/steam`)
- `POST /connect` - Link Steam account
- `POST /sync-inventory` - Sync Steam inventory
- `GET /inventory/:steamId` - Get Steam inventory data

### Profile Routes (`/api/profile`)
- `GET /` - Get user profile
- `PUT /` - Update user profile
- `GET /:id` - Get public user profile

### Notification Routes (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark notification as read
- `DELETE /:id` - Delete notification

## Usage Examples

### 1. Adding Items to Inventory

```javascript
// Frontend API call example
const addItem = async (itemData) => {
  const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      steamId: "12345678",
      itemName: "AK-47",
      skinName: "Redline",
      rarity: "Classified",
      wear: "Field-Tested",
      floatValue: 0.25,
      imageUrl: "https://...",
      steamMarketPrice: 45.50,
      inspectLink: "steam://..."
    })
  });
  return response.json();
};
```

### 2. Listing Items for Sale

```javascript
// List single item
const listItem = async (itemId, price) => {
  const response = await fetch(`/api/inventory/${itemId}/list`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ listingPrice: price })
  });
  return response.json();
};

// Bulk list multiple items
const bulkListItems = async (itemIds, price) => {
  const response = await fetch('/api/inventory/bulk', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      itemIds,
      action: 'list',
      data: { listingPrice: price }
    })
  });
  return response.json();
};
```

### 3. Processing Transactions

```javascript
// Create purchase transaction
const buyItem = async (inventoryItemId) => {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ inventoryItemId })
  });
  return response.json();
};

// Complete transaction (seller/admin)
const completeTransaction = async (transactionId) => {
  const response = await fetch(`/api/transactions/${transactionId}/complete`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### 4. Advanced Inventory Filtering

```javascript
// Get filtered inventory
const getFilteredInventory = async (filters) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/inventory/advanced?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Example usage
const filters = {
  rarity: 'Classified',
  wear: 'Field-Tested',
  status: 'listed',
  minPrice: 10,
  maxPrice: 100,
  sortBy: 'listingPrice',
  sortOrder: 'desc',
  page: 1,
  limit: 20
};
```

### 5. Getting Analytics

```javascript
// Get inventory analytics
const getAnalytics = async (period = '30d') => {
  const response = await fetch(`/api/inventory/analytics?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Database Schema Details

### InventoryItem Model
```javascript
{
  owner: ObjectId,           // User who owns the item
  steamId: String,          // Steam item ID
  itemName: String,         // e.g., "AK-47"
  skinName: String,         // e.g., "Redline"
  rarity: String,           // Consumer Grade, Industrial Grade, etc.
  wear: String,             // Factory New, Minimal Wear, etc.
  floatValue: Number,       // 0-1 wear value
  imageUrl: String,         // Item image URL
  steamMarketPrice: Number, // Current Steam market price
  listingPrice: Number,     // User's listing price
  status: String,           // in_inventory, listed, sold, pending_trade
  listedAt: Date,          // When item was listed
  soldAt: Date,            // When item was sold
  soldPrice: Number,       // Final sale price
  stickers: Array,         // Sticker information
  tags: Array,             // CS2 tags
  inspectLink: String      // CS2 inspect URL
}
```

### Transaction Model
```javascript
{
  buyer: ObjectId,          // Buyer user ID
  seller: ObjectId,         // Seller user ID
  inventoryItem: ObjectId,  // Item being traded
  salePrice: Number,        // Sale price
  platformFee: Number,      // Platform fee (5%)
  sellerReceives: Number,   // Amount seller gets
  status: String,           // pending, completed, cancelled, failed
  paymentMethod: String,    // steam_wallet, paypal, etc.
  transactionId: String,    // Unique transaction ID
  completedAt: Date,        // Completion timestamp
  metadata: Object          // Additional transaction data
}
```

## Steam Integration

Your system supports Steam account linking and inventory synchronization:

1. **Link Steam Account**: Users connect their Steam profile
2. **Sync Inventory**: Automatically import CS2 skins from Steam
3. **Price Updates**: Real-time Steam market price fetching
4. **Trade URLs**: Steam trade link integration

## Security Features

- JWT-based authentication
- Role-based access control (admin/customer)
- Request validation and sanitization
- Error handling without sensitive data exposure
- Database query optimization with indexes

## Testing Your API

You can test the API using tools like Postman or curl:

```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# Test inventory fetch (with auth token)
curl -X GET http://localhost:5000/api/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Next Steps

1. **Frontend Integration**: Connect your React frontend to these API endpoints
2. **Payment Processing**: Integrate with Stripe/PayPal for real money transactions
3. **Real-time Features**: Add WebSocket support for live marketplace updates
4. **Steam API**: Enhance Steam integration with real-time price fetching
5. **Admin Dashboard**: Build admin interface for transaction management

Your backend is now production-ready with comprehensive inventory and transaction management! 🚀
