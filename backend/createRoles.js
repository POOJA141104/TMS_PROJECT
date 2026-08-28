require("dotenv").config();

const mongoose = require("mongoose");
const Role = require("./models/Role");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const roles = [
      { name: "Super Admin" },
      { name: "Admin" },
      { name: "Student" },
      { name: "Staff" }
    ];

    await Role.insertMany(roles);

    console.log("✅ Roles created");
    process.exit();

  })
  .catch(console.error);