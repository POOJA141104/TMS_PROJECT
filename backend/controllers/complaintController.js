const Complaint = require("../models/Complaint");
const Room = require("../models/Room");

exports.getDashboard = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role?.name === "User") {
      filter = { raisedBy: req.user._id };
    } else if (req.user.role?.name !== "SuperAdmin") {
      // Staff roles
      filter = { assignedTo: req.user._id };
    }
    // SuperAdmin sees everything — filter stays {}

    const [total, pending, assigned, inProgress, onHold, completed] = await Promise.all([
      Complaint.countDocuments(filter),
      Complaint.countDocuments({ ...filter, status: "Pending" }),
      Complaint.countDocuments({ ...filter, status: "Assigned" }),
      Complaint.countDocuments({ ...filter, status: "In-Progress" }),
      Complaint.countDocuments({ ...filter, status: "On-Hold" }),
      Complaint.countDocuments({ ...filter, status: "Completed" }),
    ]);

    res.json({ success: true, data: { total, pending, assigned, inProgress, onHold, completed } });
  } catch (e) {
    console.error("Dashboard error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role?.name === "User") filter.raisedBy = req.user._id;
    else if (req.user.role?.name !== "SuperAdmin") filter.assignedTo = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type)   filter.type   = req.query.type;

    const data = await Complaint.find(filter)
      .populate("raisedBy",   "name")
      .populate("assignedTo", "name")
      .populate("department", "name shortName")
      .populate("block",      "name")
      .populate("room",       "number")
      .sort("-createdAt");

    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const { block, room, type, remarks } = req.body;

    if (!room)    return res.status(400).json({ success: false, message: "Room is required" });
    if (!type)    return res.status(400).json({ success: false, message: "Type is required" });
    if (!remarks) return res.status(400).json({ success: false, message: "Remarks are required" });

    // Get department from room
    const roomDoc = await Room.findById(room).populate("department").populate("block");

    const complaint = new Complaint({
      raisedBy:   req.user._id,
      room:       room,
      block:      roomDoc?.block?._id || block,
      department: roomDoc?.department?._id,
      type:       type,
      remarks:    remarks,
    });

    await complaint.save();
    res.status(201).json({ success: true, data: complaint });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.assignComplaint = async (req, res) => {
  try {
    const data = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.assignedTo, status: "Assigned" },
      { new: true }
    ).populate("assignedTo", "name");
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, note: req.body.note },
      { new: true }
    );
    res.json({ success: true, data });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};