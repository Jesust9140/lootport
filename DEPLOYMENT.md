# Lootdrop Deployment Guide

## 🚀 Production Deployment

### Current Setup

Your Lootdrop application is configured as a full-stack application with:

- **Frontend**: React (Create React App)
- **Backend**: Node.js/Express
- **Database**: MongoDB Atlas

### Available Scripts

#### Development

```bash
npm run dev          # Run both client and server in development mode
npm run dev:client   # Run only React development server
npm run dev:server   # Run only Express server in development
```

#### Production

```bash
npm run build        # Build React app for production
npm run start:prod   # Build and start production server
npm run start:server # Start Express server (serves built React app)
```

#### Testing

```bash
npm run serve:static # Serve built React app with 'serve' package
npm run lint         # Run ESLint on entire project
```

### 🏗️ Production Setup

1. **Build the React app**:

   ```bash
   npm run build
   ```

2. **Start the production server**:

   ```bash
   npm run start:server
   ```

3. **Or do both at once**:
   ```bash
   npm run start:prod
   ```

### 🌐 Deployment Options

#### Option 1: Traditional VPS/Server

1. Upload your code to your server
2. Install dependencies: `npm install && cd client && npm install && cd ../server && npm install`
3. Set up environment variables (MongoDB URI, etc.)
4. Build the app: `npm run build`
5. Start with PM2 or similar: `pm2 start server/server.js`

#### Option 2: Heroku

1. Create a Heroku app
2. Add MongoDB Atlas connection string to Config Vars
3. Create a Procfile: `web: npm run start:server`
4. Deploy via Git push

#### Option 3: Railway/Render

Similar to Heroku but often simpler setup:

1. Connect your GitHub repo
2. Set environment variables
3. Set build command: `npm run build`
4. Set start command: `npm run start:server`

#### Option 4: Vercel (Frontend only)

For just the React app (would need separate API hosting):

1. `npm install -g vercel`
2. `vercel --prod`

### 📦 Environment Variables

Make sure to set these in production:

- `MONGO_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: Set to "production"
- `PORT`: Server port (usually provided by hosting platform)

### 🔧 Important Files

- `client/build/`: Built React application (created by `npm run build`)
- `server/server.js`: Express server that serves both API and React app
- `client/package.json`: Contains homepage field for deployment path
- `.env`: Environment variables (not committed to Git)

### 🛠️ Client-Side Routing

Your Express server is configured to handle client-side routing properly:

```javascript
// Catch-all route sends all non-API requests to React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
```

This ensures routes like `/login`, `/dashboard`, etc. work correctly in production.

### 📱 Current Configuration

- **Homepage**: `/lootport/` (configured in client/package.json)
- **API Routes**: `/api/*` (handled by Express)
- **Static Files**: Served from `client/build/`
- **Database**: MongoDB Atlas cluster

### 🔍 Troubleshooting

1. **Build fails**: Check for ESLint errors with `npm run lint`
2. **Routes don't work**: Ensure catch-all route is enabled in server.js
3. **API not working**: Check MongoDB connection and environment variables
4. **Static files not loading**: Verify build folder exists and Express static middleware is configured

### 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas IP whitelist updated
- [ ] React app builds without errors
- [ ] Express server starts successfully
- [ ] API routes work
- [ ] Client-side routing works
- [ ] Static files serve correctly
