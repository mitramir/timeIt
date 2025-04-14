const mongoose = require("mongoose");
const Joi = require("joi");

const Plan = mongoose.model(
  "Plan",
  mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      isActive: {
        type: Boolean,
        required: true,
        default: true,
      },
      duration: {
        //in days
        type: Number,
      },
      type: {
        //0:free, 1:PAYG, 2:monthly, 3:annual
        type: Number,
        default: 1,
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
    },
    {
      timestamps: {
        createdAt: true,
        updatedAt: true,
      },
    }
  )
);

function validatePlan(plan) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    price: Joi.number().min(0).required(),
    isActive: Joi.boolean().required(),
    duration: Joi.number().allow(null),
    type: Joi.number(),
    feePerScan: Joi.number().required(),
    // feePerExtraScan: Joi.number(),
    scanCap: Joi.number().allow(null),
  });
  return schema.validate(plan);
}

exports.Plan = Plan;
exports.validate = validatePlan;
