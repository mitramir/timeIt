const mongoose = require("mongoose");
const Joi = require("joi");

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
    },
    trialStart: {
      type: Date,
    },
    trialEnd: {
      type: Date,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
    },
    unSubscribeDate: {
      type: Date,
    },
    payId: {
      type: String,
      minlength: 12,
      maxlength: 50,
    },
    balance: {
      type: Number,
      min: 0,
    },
    remainingScan: {
      type: Number,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

function validateSubscription(subscription) {
  const schema = Joi.object({
    status: Joi.Boolean().required(),
    startDate: Joi.Date().required(),
  });
  return schema.validate(subscription);
}

exports.subscriptionSchema = subscriptionSchema;
exports.Subscription = Subscription;
exports.validate = validateSubscription;
