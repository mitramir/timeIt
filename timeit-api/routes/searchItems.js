const auth = require("../middleware/auth");
const { Search, validate } = require("../models/search");
const { User } = require("../models/user");
const { Item } = require("../models/item");
const _ = require("lodash");
const SellingPartnerAPI = require("amazon-sp-api");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let queryBuilder = {
    MarketplaceId: process.env.DEFAULT_MARKETPLACE_ID,
    Query: req.body.query,
    QueryContextId: "Books",
  };

  let sellingPartner = new SellingPartnerAPI({
    region: "na", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
    refresh_token: process.env.AWS_REFRESH_TOKEN, // The refresh token of your app user
  });

  //call sp-api v0 by isbn
  let result = await sellingPartner.callAPI({
    operation: "catalogItems.listCatalogItems",
    query: queryBuilder,
    options: {
      version: "v0",
    },
  });

  //filter books only
  result = _.filter(result.Items, function (o) {
    return o.AttributeSets[0].ProductGroup == "Book";
  });

  res.send(result);
});

module.exports = router;
