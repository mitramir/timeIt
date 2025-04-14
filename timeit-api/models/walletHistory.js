const Joi = require("joi");
const mongoose = require("mongoose");

const WalletHistory = mongoose.model(
  "WalletHistory",
  new mongoose.Schema(
    {
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
      payId: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255,
      },
      type: {
        // 1:add, 2:deduct, 3:cashout
        type: Number,
        default: 1,
      },
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: true,
      },
    }
  )
);

function validateWalletHistory(walletHistory) {
  const schema = Joi.object({
    user: Joi.ObjectId().required(),
    balance: Joi.number().required(),
  });
  return schema.validate(walletHistory);
}

exports.WalletHistory = WalletHistory;
exports.validate = validateWalletHistory;
