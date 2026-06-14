const express = require("express");
const router  = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getProgrammes, createProgramme, updateProgramme, deleteProgramme } = require("../controllers/masterController");

router.get("/",       protect, getProgrammes);
router.post("/",      protect, authorize("SuperAdmin"), createProgramme);
router.put("/:id",    protect, authorize("SuperAdmin"), updateProgramme);
router.delete("/:id", protect, authorize("SuperAdmin"), deleteProgramme);

module.exports = router;