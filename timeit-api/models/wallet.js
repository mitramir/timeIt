const Joi = require("joi");
const mongoose = require("mongoose");

const Wallet = mongoose.model(
  "Wallet",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  })
);

function validateHistory(wallet) {
  const schema = Joi.object({
    user: Joi.ObjectId().required(),
    balance: Joi.number().required(),
  });
  return schema.validate(wallet);
}

exports.Wallet = Wallet;
exports.validate = validateHistory;
