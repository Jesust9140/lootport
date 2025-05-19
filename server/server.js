const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Register API routes
const skinsRoutes = require("./routes/skinsRoutes");
app.use("/api/skins", skinsRoutes);

// Serve static files from React build (optional in dev)
app.use(express.static(path.join(__dirname, "client/build")));

// Catch-all to serve React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
