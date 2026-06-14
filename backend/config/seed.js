const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db");

const seed = async () => {
  await connectDB();
  const Role       = require("../models/Role");
  const Department = require("../models/Department");
  const Programme  = require("../models/Programme");
  const User       = require("../models/User");

  await User.deleteMany({});
  await Role.deleteMany({});
  await Department.deleteMany({});
  await Programme.deleteMany({});
  console.log("🗑️  Cleared existing data");

  const roles = await Role.insertMany([
    { name:"SuperAdmin" }, { name:"User" },
    { name:"Networking Staff" }, { name:"Plumber" },
    { name:"Electrician" }, { name:"Software Developer" },
  ]);
  console.log("✅ Roles created");

  const depts = await Department.insertMany([
    { name:"Computer Science & Engineering", shortName:"CSE" },
    { name:"Electronics & Communication",    shortName:"ECE" },
    { name:"Information Technology",         shortName:"IT"  },
  ]);
  console.log("✅ Departments created");

  await Programme.insertMany([
    { department:depts[0]._id, name:"Bachelor of Technology", shortName:"B.Tech" },
    { department:depts[0]._id, name:"Master of Technology",   shortName:"M.Tech" },
    { department:depts[1]._id, name:"Bachelor of Technology", shortName:"B.Tech" },
  ]);
  console.log("✅ Programmes created");

  // ✅ Use new User() + save() — pre-save hook hashes password ONCE
  const superAdminRole = roles.find(r => r.name === "SuperAdmin");
  const admin = new User({
    name:       "Super Admin",
    username:   "superadmin",
    email:      "admin@university.edu",
    phone:      "9999999999",
    password:   "admin123",
    role:       superAdminRole._id,
    department: depts[0]._id,
  });
  await admin.save();

  console.log("✅ SuperAdmin created!");
  console.log("   Username : superadmin");
  console.log("   Password : admin123");
  await mongoose.disconnect();
  console.log("🎉 Seed complete!");
  process.exit(0);
};

seed().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});