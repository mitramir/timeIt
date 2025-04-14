const auth = require("../middleware/auth");
const { History, validate } = require("../models/history");
const { User } = require("../models/user");
const { Item } = require("../models/item");
const { AccountBalance } = require("../models/accountBalance");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const { object } = require("joi");
const { Wallet } = require("../models/wallet");
const { Subscription } = require("../models/subscription");
const moment = require("moment");
const router = express.Router();

Fawn.init(process.env.MONGO_URI);

router.get("/", async (req, res) => {
  const historyData = await History.find().sort("-dateScan");
  res.send(historyData);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(400).send("User not found.");

  const itemById = await Item.findById(req.body.item._id);
  if (!itemById) return res.status(400).send("Item not fount");

  //TODO filter scanCap/balance
  const activeSubPlan = await Subscription.findOne({
    user: user._id,
    status: true,
    $or: [
      { startDate: { $lte: moment() }, endDate: { $gte: moment() } }, // x days plan or PAYG
      { trialStart: { $lte: moment() }, trialEnd: { $gte: moment() } }, //sign up offer
    ],
  }).populate("plan");

  if (!activeSubPlan)
    return res.status(400).send("You don't have any active plan!");

  // for All except PAYG ->free tier and monthly/annual
  if (activeSubPlan.remainingScan) {
    activeSubPlan.remainingScan -= 1;
  }

  if (activeSubPlan.remainingScan === 0) {
    activeSubPlan.status = false;
  }

  // for PAYG and Free tier
  if (!activeSubPlan.endDate) {
    activeSubPlan.balance = parseFloat(
      activeSubPlan.balance - activeSubPlan.plan.feePerScan
    ).toFixed(2);
  }

  await activeSubPlan.save();

  // const wallet = await Wallet.findOne({ user: user._id });
  // wallet.amount = wallet.amount - BalanceByUser.plan.feePerScan;
  // await wallet.save();
  let history = new History({
    user: {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
    item: {
      _id: itemById._id,
    },
    price: req.body.price,
    rank: req.body.rank,
    result: req.body.result,
    timeToSell: req.body.timeToSell,
    subscribeId: activeSubPlan._id,
  });

  await history.save();
  res.send(history);

  // try {
  //   new Fawn.Task()
  //     .save("histories", history)
  //     //todo: deduct credit
  //     // .update(
  //     //   "movies",
  //     //   { _id: movie._id },
  //     //   {
  //     //     $inc: { numberInStock: -1 },
  //     //   }
  //     // )
  //     .run();

  //   res.send(history);
  // } catch (ex) {
  //   res.status(500).send("Something failed.");
  // }
});

router.get("/:id", async (req, res) => {
  const history = await History.findById(req.params.id);

  if (!history)
    return res.status(404).send("The history with the given ID was not found.");

  res.send(history);
});

router.get("/info/today_scan", auth, async (req, res) => {
  const req_user = await User.findById(req.user._id).select("-password");
  if (!req_user) return res.status(400).send("User not found.");

  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const total = await History.countDocuments({
    "user._id": req_user._id,
    dateScan: { $gte: start, $lt: end },
  });
  const success = await History.countDocuments({
    "user._id": req_user._id,
    dateScan: { $gte: start, $lt: end },
    result: true,
  });
  res.send({
    total: String(total),
    success: String(success),
    rate: parseFloat(((success * 100) / total).toFixed(2)),
  });
});

router.get("/info/my_list", auth, async (req, res) => {
  const req_user = await User.findById(req.user._id).select("-password");
  if (!req_user) return res.status(400).send("User not found.");

  const page = parseInt(req.query.page) || 1; // Get the page number from the query string or default to page 1
  const limit = parseInt(req.query.limit) || 10; // Set the number of items per page (default: 10)
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  try {
    const query = {
      "user._id": req_user._id,
    };

    const totalCount = await History.countDocuments(query); // Get the total count of items

    const list = await History.find(query)
      .populate("item")
      .skip(skip)
      .limit(limit);

    res.json({
      items: list,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/info/my_chart", auth, async (req, res) => {
  const req_user = await User.findById(req.user._id).select("-password");
  if (!req_user) return res.status(400).send("User not found.");

  const result7days = await findNumberOfScanForPastDates(req.user._id, 7);
  const result30days = await findNumberOfScanForPastWeeks(req.user._id, 28);
  const result12Months = await findNumberOfScanForPastMonths(req.user._id);

  res.send({ result7days, result30days, result12Months });
});

const findNumberOfScanForPastDates = async (userId, numberOfDays) => {
  const daysAgo = moment()
    .subtract(numberOfDays - 1, "days")
    .startOf("day");

  const scans = await History.aggregate([
    {
      $match: {
        "user._id": mongoose.Types.ObjectId(userId),
        dateScan: {
          $gte: daysAgo.toDate(),
          $lt: moment().endOf("day").toDate(),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$dateScan" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const result = Array(numberOfDays).fill(0);

  scans.forEach((scan) => {
    const index = moment(scan._id).diff(daysAgo, "days");
    result[index] = scan.count;
  });
  return result;
};

const findNumberOfScanForPastWeeks = async (userId, numberOfDays) => {
  const result30days = await findNumberOfScanForPastDates(userId, numberOfDays);

  const result = [];
  const groupSize = 7;

  const reversedArray = result30days.reverse();

  for (let i = 0; i < reversedArray.length; i += groupSize) {
    const group = reversedArray.slice(i, i + groupSize);
    const sum = group.reduce((a, b) => a + b, 0);
    result.push(sum);
  }

  return result.reverse();
};

const findNumberOfScanForPastMonths = async (userId) => {
  const twelveMonthsAgo = moment().subtract(11, "months").startOf("month");

  const scans = await History.aggregate([
    {
      $match: {
        "user._id": mongoose.Types.ObjectId(userId),
        dateScan: {
          $gte: twelveMonthsAgo.toDate(),
          $lt: moment().endOf("month").toDate(),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m", date: "$dateScan" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const result = Array(12).fill(0);

  scans.forEach((scan) => {
    const index = moment(scan._id, "YYYY-MM").diff(twelveMonthsAgo, "months");
    result[index] = scan.count;
  });

  return result;
};

module.exports = router;
