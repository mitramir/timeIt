const auth = require("../middleware/auth");
const { Offer, validate } = require("../models/offer");
const { Plan } = require("../models/plan");
const express = require("express");
const { object } = require("joi");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const offers = await Offer.find();
  res.send(offers);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const planById = await Plan.findById({ _id: req.body.plan });
  if (!planById) return res.status(400).send("Plan not found.");

  const offer = new Offer({
    name: req.body.name,
    plan: {
      _id: planById._id,
      name: planById.name,
      feePerScan: planById.feePerScan,
      // feePerExtraScan: planById.feePerExtraScan,
      scanCap: planById.scanCap,
    },
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    extraBalanceAmount: req.body.extraBalanceAmount,
    extraBalancePercentage: req.body.extraBalancePercentage,
    reduceScanFeeAmount: req.body.reduceScanFeeAmount,
    reducteScanFeePercentage: req.body.reducteScanFeePercentage,
    durationDays: req.body.durationDays,
    scanCap: req.body.scanCap,
  });

  await offer.save();
  res.send(offer);
});

module.exports = router;
