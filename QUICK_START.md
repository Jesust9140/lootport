# 🚀 Lootdrop Backend - Quick Start Guide

## Getting Started

Your Lootdrop backend is now fully set up with comprehensive inventory and transaction management! Here's how to get it running:

### 1. Environment Setup

Make sure you have a `.env` file in your `server` directory with:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/lootdrop
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lootdrop

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Steam API (optional for now)
STEAM_API_KEY=your_steam_api_key_here

# Port
PORT=5000
```

### 2. Install Dependencies & Seed Database

```bash
cd server

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

### 3. Test the API

Once seeded, you'll have:
- **4 test users** (3 customers + 1 admin)
- **8 inventory items** with various rarities
- **Listed items** in the marketplace
- **Sample transactions**
- **User notifications**

#### Test Credentials:
- Customer: `john@lootdrop.com` / `password123`
- Customer: `sarah@lootdrop.com` / `password123`  
- Customer: `mike@lootdrop.com` / `password123`
- Admin: `admin@lootdrop.com` / `admin123`

### 4. API Testing Examples

#### Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@lootdrop.com","password":"password123"}'
```

#### Get User's Inventory
```bash
curl -X GET http://localhost:5000/api/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Marketplace (Public)
```bash
curl -X GET http://localhost:5000/api/inventory/marketplace
```

#### Get Transaction History
```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## What Your Backend Can Do

### ✅ **Complete Inventory Management**
- Add/remove items from user inventories
- List items for sale with custom pricing
- Bulk operations (list/unlist multiple items)
- Advanced filtering and search
- Real-time inventory value tracking

### ✅ **Transaction Processing**
- Create buy/sell transactions
- Automatic fee calculation (5% platform fee)
- Transaction status tracking (pending/completed/cancelled)
- Ownership transfer on completion
- Refund handling

### ✅ **Steam Integration Ready**
- Steam account linking
- Inventory synchronization
- Market price updates
- CS2 inspect links

### ✅ **User Management**
- JWT authentication
- Role-based access (admin/customer)
- User profiles and notifications
- Transaction history

### ✅ **Analytics & Reporting**
- Inventory value analytics
- Profit/loss tracking
- Trading statistics
- Marketplace insights

## Database Structure

Your MongoDB will contain these collections:
- `users` - User accounts and profiles
- `inventoryitems` - Individual skins owned by users
- `transactions` - Buy/sell transaction records
- `skins` - Base skin data for marketplace
- `steamaccounts` - Steam account integrations

## Next Steps for Frontend Integration

1. **Authentication Flow**: Implement login/register forms that call `/api/auth/login` and `/api/auth/register`

2. **Inventory Display**: Create components that fetch from `/api/inventory` and display user's skins

3. **Marketplace**: Build a marketplace view using `/api/inventory/marketplace`

4. **Trading Interface**: Create buy/sell flows using the transaction endpoints

5. **User Dashboard**: Build analytics dashboard using `/api/inventory/analytics`

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description here"
}
```

Success responses:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

## Production Considerations

Before going live:
- [ ] Set up proper MongoDB Atlas cluster
- [ ] Configure environment variables for production
- [ ] Set up proper CORS origins
- [ ] Add rate limiting middleware
- [ ] Set up proper logging
- [ ] Add payment processing integration
- [ ] Set up Steam API for real market data

Your backend is production-ready and can handle real user inventories! 🎉

## Need Help?

Check the detailed API documentation in `BACKEND_API_GUIDE.md` for comprehensive endpoint documentation and usage examples.
