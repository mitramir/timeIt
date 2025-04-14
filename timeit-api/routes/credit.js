const auth = require("../middleware/auth");
const express = require("express");
const { object } = require("joi");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { User } = require("../models/user");
const { AccountBalance } = require("../models/accountBalance");
const { History } = require("../models/history");
const { Wallet } = require("../models/wallet");
const { WalletHistory } = require("../models/walletHistory");
const { Subscription } = require("../models/subscription");
const moment = require("moment");
const _ = require("lodash");

router.post("/buy", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    // Getting data from client
    let { amount } = req.body;

    // Simple validation
    if (!amount)
      return res.status(400).json({ message: "All fields are required" });
    amount = parseInt(amount);
    // Initiate payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      payment_method_types: ["card"],
      metadata: {
        name: user.firstname + " " + user.lastname,
        email: user.email,
      },
    });
    // Extracting the client secret
    const clientSecret = paymentIntent.client_secret;
    // Sending the client secret as response
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    // Catch any error and send error 500 to client
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/retrieve", auth, async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(req.body.payId);

  if (paymentIntent && paymentIntent.status === "succeeded") {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(400).send("User not found.");

    // Handle successful payment here
    const wallet = await Wallet.findOne({ user: user._id });
    wallet.amount = wallet.amount + paymentIntent.amount / 100;
    await wallet.save();

    const walletHistory = new WalletHistory({
      user: user,
      amount: paymentIntent.amount / 100,
      type: 1,
      payId: req.body.payId,
    });

    await walletHistory.save();

    return res.send(paymentIntent);
  }

  // Handle error here
  return res.send("error");
});

router.get("/mybalance", auth, async (req, res) => {
  const userByToken = await User.findById(req.user._id).select("-password");
  if (!userByToken) return res.status(400).send("User not found.");

  const accountBalance = await AccountBalance.findOne({
    user: userByToken._id,
  }).populate("plan");

  //find active subs
  //TODO: filter with balance/scanCap
  const activeSubscriptions = await Subscription.find({
    user: userByToken._id,
    $or: [
      { startDate: { $lte: moment() }, endDate: { $gte: moment() } }, // x days plan or PAYG
      { trialStart: { $lte: moment() }, trialEnd: { $gte: moment() } }, //sign up offer
      // { startDate: { $lte: moment() }, endDate: null }, //PAYG
    ],
  }).populate(["plan", "offer"]);

  res.send({
    activeSubscriptions,
  });
});

router.get("/canScan", auth, async (req, res) => {
  const userByToken = await User.findById(req.user._id).select("-password");
  if (!userByToken) return res.status(400).send("User not found.");

  const accountBalance = await AccountBalance.findOne({
    user: userByToken._id,
  }).populate("plan");

  //find active subs
  //TODO: filter with balance/scanCap
  const activeSubscriptions = await Subscription.findOne({
    user: userByToken._id,
    $or: [
      { startDate: { $lte: moment() }, endDate: { $gte: moment() } }, // x days plan or PAYG
      { trialStart: { $lte: moment() }, trialEnd: { $gte: moment() } }, //sign up offer
    ],
    status: true,
  });

  if (!activeSubscriptions)
    return res.send({
      message: "You don't have a valid/active plan, please check your plan(s)!",
      result: false,
    });
  return res.send({ message: "All ok!", result: true });
});

router.post("/use", auth, async (req, res) => {
  return res.send({ message: "Credit use" });
});

module.exports = router;
