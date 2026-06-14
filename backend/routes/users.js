const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getUsers, getStaff, createUser, updateUser, deleteUser } = require("../controllers/userController");

router.get("/",       protect, authorize("SuperAdmin"), getUsers);
router.get("/staff",  protect, getStaff);
router.post("/",      protect, authorize("SuperAdmin"), createUser);
router.put("/:id",    protect, authorize("SuperAdmin"), updateUser);
router.delete("/:id", protect, authorize("SuperAdmin"), deleteUser);

module.exports = router;