const mongoose = require("mongoose");
const Joi = require("joi");

const accountBalanceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    scan: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const AccountBalance = mongoose.model("AccountBalance", accountBalanceSchema);

function validateAccountBalance(accountBalance) {
  const schema = Joi.object({
    user: Joi.ObjectId().required(),
    plan: Joi.ObjectId().required(),
  });
  return schema.validate(accountBalance);
}

exports.accountBalanceSchema = accountBalanceSchema;
exports.AccountBalance = AccountBalance;
exports.validate = validateAccountBalance;
