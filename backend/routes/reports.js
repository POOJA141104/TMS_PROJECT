const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getComplaintReport } = require("../controllers/reportController");

router.get("/complaints", protect, authorize("SuperAdmin"), getComplaintReport);

module.exports = router;