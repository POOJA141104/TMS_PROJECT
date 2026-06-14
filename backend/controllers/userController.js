const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const data = await User.find()
      .populate("role","name")
      .populate("department","name shortName")
      .populate("programme","name shortName")
      .sort("name");
    res.json({ success:true, data });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.getStaff = async (req, res) => {
  try {
    const staffRoleNames = ["Networking Staff","Plumber","Electrician","Software Developer"];
    const Role = require("../models/Role");
    const staffRoles = await Role.find({ name: { $in: staffRoleNames } });
    const staffRoleIds = staffRoles.map(r => r._id);
    const data = await User.find({ role: { $in: staffRoleIds } })
      .populate("role","name")
      .populate("department","name shortName");
    res.json({ success:true, data });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const populated = await User.findById(user._id)
      .populate("role","name")
      .populate("department","name shortName");
    res.status(201).json({ success:true, data:populated });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password) {
      const user = await User.findById(req.params.id);
      user.set(req.body);
      await user.save();
      return res.json({ success:true, data:user });
    }
    const data = await User.findByIdAndUpdate(req.params.id, req.body, { new:true })
      .populate("role","name")
      .populate("department","name shortName");
    res.json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:"Deleted" });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};