const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
  mongoose.connect(process.env.MONGO_URI).then(() =>
    //  winston.info("connect to mongodb..")
    console.log("connect to db..")
  );
};
