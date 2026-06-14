const Complaint = require("../models/Complaint");

exports.getComplaintReport = async (req, res) => {
  try {
    let filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.programme)  filter.programme  = req.query.programme;
    if (req.query.type)       filter.type       = req.query.type;
    if (req.query.status)     filter.status     = req.query.status;
    if (req.query.assignee)   filter.assignedTo = req.query.assignee;

    const data = await Complaint.find(filter)
      .populate("raisedBy","name")
      .populate("assignedTo","name")
      .populate("department","name shortName")
      .populate("block","name")
      .populate("room","number")
      .sort("-createdAt");

    const summary = {
      total:      data.length,
      pending:    data.filter(c => c.status === "Pending").length,
      assigned:   data.filter(c => c.status === "Assigned").length,
      inProgress: data.filter(c => c.status === "In-Progress").length,
      onHold:     data.filter(c => c.status === "On-Hold").length,
      completed:  data.filter(c => c.status === "Completed").length,
    };

    res.json({ success:true, data, summary });
  } catch (e) { res.status(500).json({ success:false, message:e.message }); }
};