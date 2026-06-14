const mongoose = require("mongoose");
const ComplaintSchema = new mongoose.Schema({
  ticketId:   { type:String, unique:true },
  raisedBy:   { type:mongoose.Schema.Types.ObjectId, ref:"User",       required:true },
  assignedTo: { type:mongoose.Schema.Types.ObjectId, ref:"User" },
  department: { type:mongoose.Schema.Types.ObjectId, ref:"Department" },
  programme:  { type:mongoose.Schema.Types.ObjectId, ref:"Programme" },
  block:      { type:mongoose.Schema.Types.ObjectId, ref:"Block" },
  room:       { type:mongoose.Schema.Types.ObjectId, ref:"Room",       required:true },
  type:       { type:String, required:true },
  remarks:    { type:String, required:true },
  status:     { type:String, enum:["Pending","Assigned","In-Progress","On-Hold","Completed"], default:"Pending" },
  note:       { type:String },
  attachment: { type:String },
}, { timestamps:true });

ComplaintSchema.pre("save", async function(next) {
  if (!this.ticketId) {
    const count = await mongoose.model("Complaint").countDocuments();
    this.ticketId = `TKT-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Complaint", ComplaintSchema);