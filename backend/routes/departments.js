const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getDepartments, createDepartment, updateDepartment, deleteDepartment } = require("../controllers/masterController");

router.get("/",       protect, getDepartments);
router.post("/",      protect, authorize("SuperAdmin"), createDepartment);
router.put("/:id",    protect, authorize("SuperAdmin"), updateDepartment);
router.delete("/:id", protect, authorize("SuperAdmin"), deleteDepartment);

module.exports = router;