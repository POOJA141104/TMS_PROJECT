const Role = require("../models/Role");
const Department = require("../models/Department");
const Programme = require("../models/Programme");
const User = require("../models/User");

const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log("🌱 Database is empty. Running initial auto-seed...");

    let roles = await Role.find();
    if (roles.length === 0) {
      roles = await Role.insertMany([
        { name: "SuperAdmin" },
        { name: "User" },
        { name: "Networking Staff" },
        { name: "Plumber" },
        { name: "Electrician" },
        { name: "Software Developer" },
      ]);
      console.log("✅ Default roles created");
    }

    let depts = await Department.find();
    if (depts.length === 0) {
      depts = await Department.insertMany([
        { name: "Computer Science & Engineering", shortName: "CSE" },
        { name: "Electronics & Communication", shortName: "ECE" },
        { name: "Information Technology", shortName: "IT" },
      ]);
      console.log("✅ Default departments created");
    }

    const progCount = await Programme.countDocuments();
    if (progCount === 0 && depts.length >= 2) {
      await Programme.insertMany([
        { department: depts[0]._id, name: "Bachelor of Technology", shortName: "B.Tech" },
        { department: depts[0]._id, name: "Master of Technology", shortName: "M.Tech" },
        { department: depts[1]._id, name: "Bachelor of Technology", shortName: "B.Tech" },
      ]);
      console.log("✅ Default programmes created");
    }

    const superAdminRole = roles.find(r => r.name === "SuperAdmin" || r.name === "Super Admin");
    if (superAdminRole) {
      const admin = new User({
        name: "Super Admin",
        username: "superadmin",
        email: "admin@university.edu",
        phone: "9999999999",
        password: "admin123",
        role: superAdminRole._id,
        department: depts[0]?._id,
      });
      await admin.save();
      console.log("✅ Default SuperAdmin created (superadmin / admin123)");
    }
  } catch (err) {
    console.error("⚠️ Auto-seed check failed:", err.message);
  }
};

module.exports = autoSeed;

