const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      handleRejections: true,
      handleExceptions: true,
    })
  );

  winston.add(
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      level: "error",
      options: { useUnifiedTopology: true },
    })
  );
};
