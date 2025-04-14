const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/avatar", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (req.body.profilePhoto) {
    user.profilePhoto = req.body.profilePhoto;
    user.save();
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(
    _.pick(req.body, ["firstname", "lastname", "email", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.source = "app";
  user.profilePhoto = "";
  user.confirmationCode = crypto.randomBytes(20).toString("hex");
  await user.save();

  const link = `${process.env.BASE_URL}/account_confirmation/${user.confirmationCode}`;
  const text = `Hi ${user.firstname} \n\nPlease click on the following link to confirm your email : \n${link} \n\nIf you did not register, please ignore this email.\n\nThank you \nTimeIt team`;

  await sendEmail(user.email, "Account Confirmation", text);

  res.send("Please check your email for a confirmation link…");

  //res.header("x-auth-token", token).send(_.pick(user, ["firstname", "email"]));
});

router.post("/delete", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    user.email = "xxx" + user.email;
    user.status = "Removed";
    await user.save();
    res.send({ message: "Account deleted!", result: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "We're Sorry: We encountered an issue while processing the deletion of your account. We understand that this might be frustrating, and we apologize for any inconvenience. \nYou can contact us at contactus@timeit.ai or submit your request at timeit.ai",
    });
  }
});
module.exports = router;
