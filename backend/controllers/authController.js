const User = require("../models/User");
const jwt  = require("jsonwebtoken");
exports.login = (req,res)=>{
   res.send("Login working");
};
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success:false, message:"Please provide username and password" });
    }
    const user = await User.findOne({ username: username.toLowerCase() })
      .populate("role", "name")
      .populate("department", "name shortName")
      .populate("programme", "name shortName");
    if (!user) {
      return res.status(401).json({ success:false, message:"Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success:false, message:"Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(401).json({ success:false, message:"Account is deactivated" });
    }
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id:        user._id,
        name:       user.name,
        username:   user.username,
        email:      user.email,
        phone:      user.phone,
        role:       user.role,
        department: user.department,
        programme:  user.programme,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success:false, message:"Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("role", "name")
      .populate("department", "name shortName")
      .populate("programme", "name shortName");
    res.status(200).json({ success:true, data:user });
  } catch (err) {
    res.status(500).json({ success:false, message:"Server error" });
  }
};

module.exports = { login, getMe };