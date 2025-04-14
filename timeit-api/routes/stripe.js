const auth = require("../middleware/auth");
const express = require("express");
const { object } = require("joi");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", async (req, res) => {
  // Get the signature from the headers
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    // Check if the event is sent from Stripe or a third party
    // And parse the event
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // Handle what happens if the event is not from Stripe
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
  // Event when a payment is initiated
  if (event.type === "payment_intent.created") {
    console.log(`${event.data.object.metadata.name} initated payment!`);
  }
  // Event when a payment is succeeded
  if (event.type === "payment_intent.succeeded") {
    console.log(`${event.data.object.metadata.name} succeeded payment!`);
    // fulfilment
  }
  res.json({ ok: true });
});

module.exports = router;
