require("dotenv").config();

const mongoose = require("mongoose");
const Role = require("./models/Role");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const roles = await Role.find();
    console.log(roles);
    process.exit();
  })
  .catch(console.error);