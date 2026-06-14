const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getBlocks, createBlock, updateBlock, deleteBlock } = require("../controllers/masterController");

router.get("/",       protect, getBlocks);
router.post("/",      protect, authorize("SuperAdmin"), createBlock);
router.put("/:id",    protect, authorize("SuperAdmin"), updateBlock);
router.delete("/:id", protect, authorize("SuperAdmin"), deleteBlock);

module.exports = router;