const auth = require("../middleware/auth");
const { Plan, validate } = require("../models/plan");
const { User } = require("../models/user");
const express = require("express");
const { object } = require("joi");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const plans = await Plan.find();
  res.send(plans);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const plan = new Plan({
    name: req.body.name,
    price: req.body.price,
    isActive: req.body.isActive,
    duration: req.body.duration,
    type: req.body.type,
    feePerScan: req.body.feePerScan,
    // feePerExtraScan: req.body.feePerExtraScan,
    scanCap: req.body.scanCap,
  });

  await plan.save();
  res.send(plan);
});

module.exports = router;
