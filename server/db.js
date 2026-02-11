const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB);

var db = mongoose.connection;

db.on("connected", () => {
  console.log("Mongodb is connected");
});

db.on("error", () => {
  console.log("Error");
});

module.exports = mongoose;
