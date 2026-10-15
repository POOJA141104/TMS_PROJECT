require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(url => url.trim())
  : ["http://localhost:3000", "http://localhost"];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl, server-to-server, reverse proxy)
    if (!origin) return callback(null, true);
    if (!process.env.CLIENT_URL || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Health Check Endpoints
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", timestamp: new Date() }));
app.get("/api/health", (req, res) => res.status(200).json({ status: "healthy", timestamp: new Date() }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/departments", require("./routes/departments"));
app.use("/api/programmes", require("./routes/programmes"));
app.use("/api/blocks", require("./routes/blocks"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/roles", require("./routes/roles"));
app.use("/api/reports", require("./routes/reports"));

// MongoDB Connection & Auto-Seed
const autoSeed = require("./config/autoSeed");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await autoSeed();
  })
  .catch(err => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});