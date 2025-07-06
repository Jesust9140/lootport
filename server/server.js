import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

// I should probably move this to a health check endpoint later
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

connectDB();

// TODO: need to add production domains when I deploy this
// maybe also implement rate limiting for production
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
}
app.use(cors(corsOptions));

// I might need to increase this limit when users start uploading profile pics
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'lootdrop-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

import passport from './config/passport.js';

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.use("/lootport", express.static("public"));

app.use("/api/skins", skinsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", steamAuthRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/steam", steamRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
