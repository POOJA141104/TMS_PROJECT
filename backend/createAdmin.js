require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Role = require("./models/Role");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const role = await Role.findOne({ name: "Super Admin" });

    if (!role) {
      console.log("❌ Super Admin role not found");
      process.exit();
    }

    const existing = await User.findOne({ username: "superadmin" });

    if (existing) {
      console.log("⚠️ User already exists");
      process.exit();
    }

    const user = new User({
      name: "Super Admin",
      username: "superadmin",
      email: "admin@example.com",
      phone: "9876543210",
      password: "admin123",
      role: role._id,
      isActive: true
    });

    await user.save();

    console.log("✅ Super Admin created!");
    process.exit();

  })
  .catch(console.error);