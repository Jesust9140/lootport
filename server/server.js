const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express(); // 

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // 

// ROUTES
app.use("/api/skins", require("./routes/skinRoutes"));
// Serve login and register HTML pages
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});



// DEFAULT LANDING PAGE
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/landing.html");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
