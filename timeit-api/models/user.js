const config = require("config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastname: {
      type: String,
      // required: false,
      default: null,
      // minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    profilePhoto: String,
    source: String,
    lastVisited: { type: Date, default: new Date() },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Removed"],
      default: "Pending",
    },
    confirmationCode: {
      type: String,
      // unique: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, source: this.source },
    config.get("jwtPrivateKey")
  );
  return token;
};

function validateUser(User) {
  const Schema = Joi.object({
    firstname: Joi.string().min(2).max(255),
    lastname: Joi.string().allow(null).allow("").max(255),
    email: Joi.string().min(5).max(255).required().email(),
    password: new PasswordComplexity({
      min: 5,
      max: 50,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 2,
    }).required(),
    resetPasswordToken: Joi.string().allow(null),
  });
  return Schema.validate(User);
}

userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validate = validateUser;
