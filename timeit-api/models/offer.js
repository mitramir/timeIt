const mongoose = require("mongoose");
const Joi = require("joi");

const offerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    plan: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 50,
        },
        feePerScan: {
          type: Number,
          required: true,
        },
        // feePerExtraScan: {
        //   type: Number,
        //   default: null,
        // },
        scanCap: {
          type: Number,
          default: null,
        },
      }),
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 512,
    },
    extraBalanceAmount: {
      type: Number,
      default: null,
    },
    extraBalancePercentage: {
      type: Number,
      default: null,
    },
    reduceScanFeeAmount: {
      type: Number,
      default: null,
    },
    reducteScanFeePercentage: {
      type: Number,
      default: null,
    },
    durationDays: {
      type: Number,
      default: null,
    },
    scanCap: {
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

const Offer = mongoose.model("Offer", offerSchema);

function validateOffer(offer) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255),
    plan: Joi.string(),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
    description: Joi.string().allow(null),
    extraBalanceAmount: Joi.number().allow(null),
    extraBalancePercentage: Joi.number().allow(null),
    reduceScanFeeAmount: Joi.number().allow(null),
    reducteScanFeePercentage: Joi.number().allow(null),
    durationDays: Joi.number().allow(null),
    scanCap: Joi.number().allow(null),
  });
  return schema.validate(offer);
}

exports.offerSchema = offerSchema;
exports.Offer = Offer;
exports.validate = validateOffer;
