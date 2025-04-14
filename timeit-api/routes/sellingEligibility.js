const auth = require("../middleware/auth");
const SellingPartnerAPI = require("amazon-sp-api");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  if (!req.body.asin) return res.status(400).send("ASIN is required");

  let queryBuilder = {
    marketplaceIds: process.env.DEFAULT_MARKETPLACE_ID,
    asin: req.body.asin,
    program: "INBOUND",
  };

  let sellingPartner = new SellingPartnerAPI({
    region: "na", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
    refresh_token: process.env.AWS_REFRESH_TOKEN, // The refresh token of your app user
  });

  //call sp-api
  let result = await sellingPartner.callAPI({
    operation: "fbaInboundEligibility.getItemEligibilityPreview",
    query: queryBuilder,
    options: {
      version: "v1",
    },
  });

  res.send(result);
});

module.exports = router;
