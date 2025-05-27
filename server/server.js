import express from "express";
import path from "path";
import connectDB from "./config/db.js"; 
// import skinsRoutes from "./routes/skinRoutes.js";
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from 'mongoose';


dotenv.config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/skins", skinsRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve static files only in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
