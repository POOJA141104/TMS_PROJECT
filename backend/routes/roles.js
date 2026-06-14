const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getRoles, createRole, updateRole, deleteRole } = require("../controllers/masterController");

router.get("/",       protect, getRoles);
router.post("/",      protect, authorize("SuperAdmin"), createRole);
router.put("/:id",    protect, authorize("SuperAdmin"), updateRole);
router.delete("/:id", protect, authorize("SuperAdmin"), deleteRole);

module.exports = router;