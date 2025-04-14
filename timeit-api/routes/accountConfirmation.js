const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");
const moment = require("moment");
const { Offer } = require("../models/offer");
const { Plan } = require("../models/plan");
const { Subscription } = require("../models/subscription");
const { AccountBalance } = require("../models/accountBalance");
const { Wallet } = require("../models/wallet");

router.get("/:token", async (req, res) => {
  res.render("account_confirmation", { title: "TimeIt Account Confirmation" });
});

router.post("/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      confirmationCode: req.params.token,
    });
    if (!user) return res.status(400).send("invalid link or expired");

    let checkForRemovedUser = await User.findOne({
      email: "xxx" + user.email,
    });

    const today = moment().startOf("day");

    //find offer
    const offerByDate = await Offer.findOne({
      startDate: {
        $lte: today,
      },
      endDate: {
        $gte: today,
      },
    });

    const wallet = new Wallet({
      user: user,
      status: true,
    });

    if (offerByDate) {
      //find plan
      const planById = await Plan.findById(offerByDate.plan._id);
      //calculate date
      const trialEndDay = offerByDate.durationDays
        ? moment().add(offerByDate.durationDays, "days")
        : null;
      const endDate = trialEndDay;

      //subscribe for free tier
      if (planById && !checkForRemovedUser) {
        const subscription = new Subscription({
          user: user,
          startDate: today,
          endDate: endDate ? endDate : null,
          trialStart: today,
          trialEnd: trialEndDay,
          plan: planById,
          offer: offerByDate,
          unSubscribeDate: null,
          payId: null,
          balance: offerByDate.extraBalanceAmount,
          remainingScan: offerByDate.scanCap,
          status: true,
        });
        await subscription.save();

        const accountBalance = new AccountBalance({
          user: user,
          plan: planById,
          amount: 0,
          scan: offerByDate.scanCap,
        });

        // wallet.amount = offerByDate.extraBalanceAmount;
        wallet.amount = 0;

        await accountBalance.save();
      }
      //there is no valid offer found or the user signed up previously
      else {
        const accountBalance = new AccountBalance({
          user: user,
          plan: null,
          amount: 0,
          scan: 0,
        });

        // wallet.amount = offerByDate.extraBalanceAmount;
        wallet.amount = 0;

        await accountBalance.save();
      }
    }

    await wallet.save();

    user.status = "Active";
    user.confirmationCode = undefined;
    await user.save();

    const text = `Dear ${user.firstname} \n\nYour account is active now. Please use your email to login. \n\nHappy scanning! \nTimeIt team`;

    await sendEmail(user.email, "Account Activation", text);

    res.send(`
    <div style="max-width: 600px; margin: 50px auto; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
     <img src="/static/timeit-icon.png" alt="Image" style="width: 50%; height: auto; border-radius: 8px 8px 0 0; margin-top: 30px;">
     <p style="font-size: 24px; line-height: 1.5; padding: 40px;">Confirmation is Done.. Your Account is Active Now!</p>
    </div>
  `);
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

module.exports = router;
