const auth = require("../middleware/auth");
const { Offer } = require("../models/offer");
const { Plan } = require("../models/plan");
const express = require("express");
const { object } = require("joi");
const { Subscription } = require("../models/subscription");
const router = express.Router();
const Stripe = require("stripe");
const { User } = require("../models/user");
const { Wallet } = require("../models/wallet");
const { WalletHistory } = require("../models/walletHistory");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const moment = require("moment");
const { AccountBalance } = require("../models/accountBalance");

router.get("/", auth, async (req, res) => {});

router.post("/", auth, async (req, res) => {
  const type = req.body.type;
  const planByType = await Plan.findOne({ type: req.body.type });
  if (!planByType) return res.status(400).send("Plan not found.");

  const paymentIntent = await stripe.paymentIntents.retrieve(req.body.payId);

  if (!paymentIntent || paymentIntent.status !== "succeeded")
    // Handle error here
    return res.status(400).send("Payment Error");

  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(400).send("User not found.");

  // Handle successful payment here
  const wallet = await Wallet.findOne({ user: user._id });
  wallet.amount = wallet.amount - paymentIntent.amount / 100;
  await wallet.save();

  const walletHistory = new WalletHistory({
    user: user,
    amount: paymentIntent.amount / 100,
    type: planByType.type,
    payId: req.body.payId,
  });

  await walletHistory.save();

  const today = moment();

  const accountBalanceByUser = await AccountBalance.findOne({
    user: user._id,
  });
  accountBalanceByUser.amount =
    accountBalanceByUser.amount + paymentIntent.amount / 100;
  accountBalanceByUser.plan = planByType._id;
  await accountBalanceByUser.save();

  const subscription = new Subscription({
    user: user,
    startDate: today,
    endDate: planByType.duration
      ? moment().add(planByType.duration, "days")
      : null,
    trialStart: null,
    trialEnd: null,
    plan: planByType,
    offer: null,
    unSubscribeDate: null,
    payId: req.body.payId,
    balance: paymentIntent.amount / 100,
    remainingScan: planByType.remainingScan
      ? planByType.remainingScan
      : paymentIntent.amount / 100 / planByType.feePerScan,
  });
  await subscription.save();

  res.send(subscription);
});

router.post("/status", auth, async (req, res) => {
  let subscribeById = await Subscription.findById(req.body.id);
  //if active one plan, other plan will deactive automatically.
  if (req.body.status) {
    await Subscription.updateMany(
      {
        user: req.user._id,
        status: true,
      },
      { status: false }
    );
  }
  subscribeById.status = req.body.status;
  subscribeById.save();
  //if deactive, and there is no active plan need to warn user
  if (!req.body.status) {
    return res.send({
      status: "Warning",
      message:
        "You don't have any active plan. You need an active plan to scan a book!",
    });
  }
  return res.send({ status: "Successful", message: "Activation done!" });
});

module.exports = router;
