const auth = require("../middleware/auth");
const { Scan, validate } = require("../models/scan");
const _ = require("lodash");
const SellingPartnerAPI = require("amazon-sp-api");
const express = require("express");
const vertexai = require("../utils/vertexAI");
const { Item } = require("../models/item");
const { History } = require("../models/history");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let queryBuilder = {
    MarketplaceId: process.env.DEFAULT_MARKETPLACE_ID,
    ItemType: "Asin",
    Asins: req.body.isbn,
  };

  let sellingPartner = new SellingPartnerAPI({
    region: "na", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
    refresh_token: process.env.AWS_REFRESH_TOKEN, // The refresh token of your app user
  });

  //call sp-api v0 by isbn
  let result = await sellingPartner.callAPI({
    operation: "productPricing.getCompetitivePricing",
    query: queryBuilder,
    options: {
      version: "v0",
    },
  });

  let itemByAsin = await Item.findOne({ asin: req.body.isbn });
  if (!itemByAsin || itemByAsin.length == 0)
    return res.status(400).send("Asin not found");

  let AverageRank = null;
  let historyByItemId = await History.find({ item: itemByAsin._id });
  if (!historyByItemId || historyByItemId.length == 0) AverageRank = "-";
  //todo: add else
  let ranksData = _.map(historyByItemId, "rank");
  let ranks = _.map(
    ranksData,
    (arr) => _.find(arr, { ProductCategoryId: "book_display_on_website" })?.Rank
  );
  AverageRank = _.mean(ranks);

  const dataToPredict = {
    prices: result[0].Product.CompetitivePricing.CompetitivePrices,
    ranks: result[0].Product.SalesRankings,
    item: itemByAsin,
  };
  const timeToSell = await vertexai(dataToPredict);
  result[0].timeToSell = timeToSell;
  result[0].predictionResult = timeToSell <= 183 ? true : false;
  result[0].item = itemByAsin;
  result[0].averageRank = AverageRank;
  res.send(result[0]);
});

module.exports = router;
