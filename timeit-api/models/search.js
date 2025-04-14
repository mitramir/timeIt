const Joi = require("joi");
const mongoose = require("mongoose");

const Search = mongoose.model(
  "Search",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    query: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    dateSearch: {
      type: Date,
      required: true,
      default: Date.now,
    },
  })
);

function validateSearch(search) {
  const schema = Joi.object({
    query: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(search);
}

exports.Search = Search;
exports.validate = validateSearch;
