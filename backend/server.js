require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

app.listen(5000, () => {
  console.log("🚀 Backend running on port 5000");
});