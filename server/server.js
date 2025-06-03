import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js"; 
import skinsRoutes from "./routes/skinRoutes.js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// API routes
app.use("/api/skins", skinsRoutes);

// Catch-all: send back React's index.html for any route not handled above
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

// 404 handler -- come back to this error for Idea to write it.
// app.use((req, res, next) => {
//   res.status(404).send("Route not found");
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
