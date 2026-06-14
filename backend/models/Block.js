const mongoose = require("mongoose");

const BlockSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  programme:  { type: mongoose.Schema.Types.ObjectId, ref: "Programme",  required: true },
  name:       { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Block", BlockSchema);