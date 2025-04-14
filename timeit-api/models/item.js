const mongoose = require("mongoose");
const Joi = require("joi");
const { object } = require("joi");

const itemSchema = mongoose.Schema({
  isbn10: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  asin: {
    type: String,
    requred: true,
  },
  attributes: Object,
  identifiers: Array,
  images: Array,
  productTypes: Array,
  ranks: Array,
  salesRankings: Array,
  summaries: Array,
  variations: Array,
});

const Item = mongoose.model("Item", itemSchema);

exports.itemSchema = itemSchema;
exports.Item = Item;
