# Steam Authentication Implementation Guide

## Overview

This implementation provides complete Steam OpenID authentication for LootDrop, allowing users to:

- Log in with Steam accounts
- Link Steam accounts to existing accounts
- Create new accounts using Steam authentication
- Access Steam profile data and inventory

## Setup Instructions

### 1. Steam API Key Setup

1. Go to [Steam Community](https://steamcommunity.com/dev/apikey)
2. Register for a Steam API key
3. Add your API key to your `.env` file:

```bash
STEAM_API_KEY=your-steam-api-key-here
STEAM_RETURN_URL=http://localhost:5000/api/auth/steam/return
STEAM_REALM=http://localhost:5000/
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-here
```

### 2. Environment Configuration

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp server/.env.example server/.env
```

### 3. Install Dependencies

The required dependencies have been installed:

- `passport` - Authentication middleware
- `passport-steam` - Steam OpenID strategy
- `express-session` - Session management

### 4. Database Models

The `SteamAccount` model has been configured to store:

- Steam ID and Steam ID64
- Display name and profile URL
- Avatar and real name
- Verification status
- Country code and linking timestamp

## Authentication Flow

### 1. Steam Login Process

1. User clicks "Login with Steam" button
2. Frontend redirects to `/api/auth/steam`
3. Passport initiates Steam OpenID authentication
4. User authenticates with Steam
5. Steam redirects back to `/api/auth/steam/return`
6. Backend processes the Steam profile data

### 2. Account Handling

**For existing Steam accounts:**

- User is automatically logged in
- JWT token is generated
- Redirected to frontend with token

**For new Steam accounts:**

- Steam profile data is stored in session
- User is redirected to frontend for account creation/linking
- Two options: Link to existing account or create new account

### 3. Frontend Routes

- `/auth-success` - Handles successful authentication with token
- `/steam-linking` - Handles account creation/linking for new Steam users
- `/auth` - Enhanced to handle Steam authentication errors and redirects

## API Endpoints

### Steam Authentication

- `GET /api/auth/steam` - Initiate Steam login
- `GET /api/auth/steam/return` - Steam callback handler
- `POST /api/auth/steam/link` - Link Steam to existing account
- `POST /api/auth/steam/register` - Create new account with Steam

### Steam Account Management

- `POST /api/steam/connect` - Connect Steam account (manual)
- `GET /api/steam/profile` - Get Steam profile data
- `POST /api/steam/verify/generate` - Generate verification code
- `POST /api/steam/verify` - Verify Steam account ownership
- `POST /api/steam/import-inventory` - Import Steam inventory
- `PUT /api/steam/trade-url` - Set Steam trade URL

## Frontend Components

### AuthSuccess.jsx

Handles successful authentication and token storage.

### SteamLinking.jsx

Provides interface for:

- Linking Steam account to existing user
- Creating new account with Steam data
- Handling errors and validation

### Updated Auth.jsx

- Real Steam authentication instead of mock data
- Error handling for Steam authentication failures
- Automatic redirect handling for Steam flows

## Security Features

1. **Session Management**: Steam profile data stored securely in server sessions
2. **JWT Tokens**: Secure token-based authentication after Steam verification
3. **Account Validation**: Prevents duplicate Steam account linking
4. **Error Handling**: Comprehensive error handling for all failure scenarios

## Testing the Implementation

### Prerequisites

1. Set up Steam API key in environment variables
2. Ensure MongoDB is running
3. Start both backend and frontend servers

### Test Cases

1. **New User with Steam**: Click Steam login → Create account → Should redirect to profile
2. **Existing User Linking**: Login normally → Go to profile → Link Steam account
3. **Returning Steam User**: Should automatically login and redirect
4. **Error Scenarios**: Test with invalid API keys, network failures, etc.

## Production Considerations

1. **HTTPS Required**: Steam OpenID requires HTTPS in production
2. **Domain Configuration**: Update Steam return URLs for production domain
3. **Session Storage**: Consider Redis for session storage in production
4. **Error Monitoring**: Implement comprehensive error logging
5. **Rate Limiting**: Add rate limiting for authentication endpoints

## Troubleshooting

### Common Issues

1. **Steam API Key Not Working**

   - Verify key is valid on Steam Community
   - Check environment variables are loaded correctly

2. **Redirect Loop**

   - Ensure return URLs match exactly between Steam config and environment
   - Check frontend and backend URLs are correct

3. **Session Data Lost**

   - Verify session configuration in server.js
   - Check session secret is set properly

4. **CORS Issues**
   - Ensure CORS is configured for authentication endpoints
   - Verify credentials are included in CORS settings

## Next Steps

1. **Inventory Sync**: Implement full Steam inventory synchronization
2. **Trade Integration**: Add Steam trade offer functionality
3. **Profile Enhancement**: Display Steam profile data in user profiles
4. **Notification System**: Add Steam-related notifications
5. **Admin Tools**: Create admin interface for Steam account management

## Files Modified/Created

### Backend

- `config/passport.js` - Passport Steam strategy configuration
- `routes/steamAuthRoutes.js` - Steam authentication routes
- `server.js` - Added session and passport middleware

### Frontend

- `pages/AuthSuccess.jsx` - Success page for authentication
- `pages/SteamLinking.jsx` - Steam account linking interface
- `api/steamAPI.js` - Real Steam authentication functions
- `pages/Auth.jsx` - Enhanced with Steam redirect handling
- `App.js` - Added new routes for Steam authentication

This implementation provides a production-ready Steam authentication system with proper security, error handling, and user experience considerations.
