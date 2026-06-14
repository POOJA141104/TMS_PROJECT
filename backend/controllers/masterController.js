const Department = require("../models/Department");
const Programme  = require("../models/Programme");
const Block      = require("../models/Block");
const Room       = require("../models/Room");
const Role       = require("../models/Role");

// ── DEPARTMENTS ──────────────────────────────────────────────────────────────
exports.getDepartments = async (req, res) => {
  try {
    const data = await Department.find().sort("name");
    res.json({ success:true, data });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};
exports.createDepartment = async (req, res) => {
  try {
    const data = await Department.create(req.body);
    res.status(201).json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.updateDepartment = async (req, res) => {
  try {
    const data = await Department.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:"Deleted" });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};

// ── PROGRAMMES ───────────────────────────────────────────────────────────────
exports.getProgrammes = async (req, res) => {
  try {
    const data = await Programme.find().populate("department","name shortName").sort("name");
    res.json({ success:true, data });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};
exports.createProgramme = async (req, res) => {
  try {
    const data = await Programme.create(req.body);
    res.status(201).json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.updateProgramme = async (req, res) => {
  try {
    const data = await Programme.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.deleteProgramme = async (req, res) => {
  try {
    await Programme.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:"Deleted" });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};

// ── BLOCKS ────────────────────────────────────────────────────────────────────
exports.getBlocks = async (req, res) => {
  try {
    const data = await Block.find()
      .populate("department","name shortName")
      .populate("programme","name shortName")
      .sort("name");
    res.json({ success:true, data });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};
exports.createBlock = async (req, res) => {
  try {
    const data = await Block.create(req.body);
    res.status(201).json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.updateBlock = async (req, res) => {
  try {
    const data = await Block.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.deleteBlock = async (req, res) => {
  try {
    await Block.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:"Deleted" });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};

// ── ROOMS ─────────────────────────────────────────────────────────────────────
exports.getRooms = async (req, res) => {
  try {
    const filter = req.query.block ? { block: req.query.block } : {};
    const data = await Room.find(filter)
      .populate("department","name shortName")
      .populate("programme","name shortName")
      .populate("block","name")
      .sort("number");
    res.json({ success:true, data });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};
exports.createRoom = async (req, res) => {
  try {
    const data = await Room.create(req.body);
    res.status(201).json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.updateRoom = async (req, res) => {
  try {
    const data = await Room.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:"Deleted" });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};

// ── ROLES ─────────────────────────────────────────────────────────────────────
exports.getRoles = async (req, res) => {
  try {
    const data = await Role.find().sort("name");
    res.json({ success:true, data });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};
exports.createRole = async (req, res) => {
  try {
    const data = await Role.create(req.body);
    res.status(201).json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.updateRole = async (req, res) => {
  try {
    const data = await Role.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json({ success:true, data });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};
exports.deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ success:true, message:"Deleted" });
  } catch (e) { res.status(400).json({ success:false, message:e.message }); }
};