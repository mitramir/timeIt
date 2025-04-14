const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  //Generate and set password reset token
  user.generatePasswordReset();
  await user.save();

  const link = `${process.env.BASE_URL}/password_reset/${user._id}/${user.resetPasswordToken}`;
  const text = `Hi ${user.firstname} \n\nPlease click on the following link to reset your password: \n${link} \n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nThank you \nTimeIt team`;

  await sendEmail(user.email, "Password reset", text);

  res.send("**Password reset link sent to your email account.");
});

router.get("/:userId/:token", async (req, res) => {
  res.render("password_reset", { title: "TimeIt Reset Password" });
});

router.post("/:userId/:token", async (req, res) => {
  try {
    const schema = Joi.object({
      newPassword: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({
      _id: req.params.userId,
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).send(`
    <div style="max-width: 600px; margin: 50px auto; text-align: center;">
      <p style="font-size: 24px; line-height: 1.5; margin-bottom: 20px;">Sorry, your link is invalid or the token is expired.</p>
    </div>
  `);

    const salt = await bcrypt.genSalt(10);
    if (req.body.newPassword !== req.body.confirmPassword)
      return res.status(400).send("Confirmed password does not match!");
    user.password = await bcrypt.hash(req.body.newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send(`
  <div style="max-width: 600px; margin: 50px auto; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
    <img src="/static/timeit-icon.png" alt="Image" style="width: 50%; height: auto; border-radius: 8px 8px 0 0; margin-top: 30px;">
    <p style="font-size: 24px; line-height: 1.5; padding: 40px;">Password reset successfully done! Please use your new password to log in to the app.</p>
  </div>
  `);
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

function validate(req) {
  const Schema = Joi.object({
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
  });
  return Schema.validate(req);
}

module.exports = router;
