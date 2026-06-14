const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getRooms, createRoom, updateRoom, deleteRoom } = require("../controllers/masterController");

router.get("/",       protect, getRooms);
router.post("/",      protect, authorize("SuperAdmin"), createRoom);
router.put("/:id",    protect, authorize("SuperAdmin"), updateRoom);
router.delete("/:id", protect, authorize("SuperAdmin"), deleteRoom);

module.exports = router;