import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

// Configure environment variables FIRST
dotenv.config();

// Log Steam API key status for debugging
console.log('🔑 Steam API Key status:', process.env.STEAM_API_KEY ? '✅ Configured' : '❌ Missing');

import connectDB from "./config/db.js";
import skinsRoutes from "./routes/skinRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import steamAuthRoutes from "./routes/steamAuthRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import steamRoutes from "./routes/steamRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Connect to the database
connectDB();

// CORS middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"], // Support both ports
  credentials: true, // Allow credentials if needed
  methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed HTTP methods
}
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'lootdrop-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Import passport (environment variables should be loaded by now)
import passport from './config/passport.js';

// Passport middleware  
app.use(passport.initialize());
app.use(passport.session());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// Serve static files from the 'public' directory
app.use("/lootport", express.static("public"));


// API routes
app.use("/api/skins", skinsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", steamAuthRoutes); // Steam authentication routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/steam", steamRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/transactions", transactionRoutes);

// Catch-all: send back React's index.html for any route not handled above
// This enables client-side routing (React Router) to work properly
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
