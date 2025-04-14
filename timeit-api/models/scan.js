const Joi = require("joi");
const mongoose = require("mongoose");

const Scan = mongoose.model(
  "Scan",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    dateScan: {
      type: Date,
      required: true,
      default: Date.now,
    },
  })
);

function validateScan(scan) {
  const schema = Joi.object({
    isbn: Joi.string().min(10).max(14).required(),
    query: Joi.string().min(4).max(255),
  });
  return schema.validate(scan);
}

exports.Scan = Scan;
exports.validate = validateScan;
