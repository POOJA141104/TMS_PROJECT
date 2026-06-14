const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getDashboard, getComplaints, createComplaint, assignComplaint, updateStatus } = require("../controllers/complaintController");

router.get("/dashboard", protect, getDashboard);
router.get("/",          protect, getComplaints);
router.post("/",         protect, createComplaint);
router.put("/:id/assign",protect, authorize("SuperAdmin"), assignComplaint);
router.put("/:id/status",protect, updateStatus);

module.exports = router;