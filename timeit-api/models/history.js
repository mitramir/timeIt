const Joi = require("joi");
const mongoose = require("mongoose");

const History = mongoose.model(
  "History",
  new mongoose.Schema({
    user: {
      type: new mongoose.Schema({
        firstname: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 50,
        },
        lastname: {
          type: String,
          default: null,
          maxlength: 50,
        },
        email: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 255,
        },
      }),
      required: true,
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
    price: {
      type: Array,
      default: [],
    },
    rank: {
      type: Array,
      default: [],
    },
    result: {
      type: Boolean,
      default: false,
    },
    timeToSell: {
      type: Number,
    },
    subscribeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
  })
);

function validateHistory(history) {
  const schema = Joi.object({
    asin: Joi.string().required(),
    price: Joi.array().required(),
    rank: Joi.array().required(),
    result: Joi.boolean().required(),
    timeToSell: Joi.number(),
    item: Joi.object(),
  });
  return schema.validate(history);
}

exports.History = History;
exports.validate = validateHistory;
