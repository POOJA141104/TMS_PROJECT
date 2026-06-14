const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ success:false, message:"Not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("role", "name");
    if (!user) {
      return res.status(401).json({ success:false, message:"User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ success:false, message:"Not authorized, token failed" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role?.name)) {
      return res.status(403).json({ success:false, message:"Not authorized for this role" });
    }
    next();
  };
};

module.exports = { protect, authorize };