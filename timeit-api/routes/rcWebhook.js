const webhookAuth = require("../middleware/webhookAuth");
const express = require("express");
const router = express.Router();
const { Plan } = require("../models/plan");
const { User } = require("../models/user");
const { WalletHistory } = require("../models/walletHistory");
const { AccountBalance } = require("../models/accountBalance");
const { Subscription } = require("../models/subscription");
const moment = require("moment");

router.post("/", webhookAuth, async (req, res) => {
  const productId = req.body.event.product_id;
  const getType = productId.split("_")[5];
  const planByType = await Plan.findOne({ type: getType });
  if (!planByType) return res.status(400).send("Plan not found.");

  const userId = req.body.event.subscriber_attributes.timeitId.value;
  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(400).send("User not found.");

  const transactionId = req.body.event.transaction_id;

  const walletHistory = new WalletHistory({
    user: user,
    amount: planByType.price,
    type: getType,
    payId: transactionId,
  });
  await walletHistory.save();

  const today = moment();

  const accountBalanceByUser = await AccountBalance.findOne({
    user: user._id,
  });
  accountBalanceByUser.amount = accountBalanceByUser.amount + planByType.price;
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
    payId: transactionId,
    balance: planByType.price,
    remainingScan: planByType.remainingScan
      ? planByType.remainingScan
      : planByType.price / planByType.feePerScan,
  });
  await subscription.save();

  return res.status(200).send("Plan Purchased!");
});

module.exports = router;
