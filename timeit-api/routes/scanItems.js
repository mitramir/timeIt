const auth = require("../middleware/auth");
const { Scan, validate } = require("../models/scan");
const { User } = require("../models/user");
const { Item } = require("../models/item");
const _ = require("lodash");
const SellingPartnerAPI = require("amazon-sp-api");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let queryBuilder = { MarketplaceId: process.env.DEFAULT_MARKETPLACE_ID };
  let isbn = "";

  let itemByIsbn10 = await Item.find({ isbn10: req.body.isbn });
  if (itemByIsbn10 && itemByIsbn10.length > 0) return res.send(itemByIsbn10);

  let itemByIsbn13 = await Item.find({ isbn13: req.body.isbn });
  if (itemByIsbn13 && itemByIsbn13.length > 0) return res.send(itemByIsbn13);

  let itemByIsAsin = await Item.find({ asin: req.body.isbn });
  if (itemByIsAsin && itemByIsAsin.length > 0) return res.send(itemByIsAsin);

  queryBuilder.ISBN = req.body.isbn;
  isbn = req.body.isbn;

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

  let bookArr = [];
  for (let book of result) {
    //check db, if asin exist return from db
    let item = await Item.findOne({
      asin: book.Identifiers.MarketplaceASIN.ASIN,
    });

    if (item && item.length > 0) {
      item.isbn10 = item.isbn10 ? item.isbn10 : isbn.length == 10 ? isbn : null;
      item.isbn13 = item.isbn13 ? item.isbn13 : isbn.length == 13 ? isbn : null;
      item.attributes = {
        Author: book.AttributeSets[0].Author ?? null,
        Binding: book.AttributeSets[0].Binding ?? null,
        NumberOfPages: book.AttributeSets[0].NumberOfPages ?? null,
        ProductGroup: book.AttributeSets[0].ProductGroup ?? null,
        ProductTypeName: book.AttributeSets[0].ProductTypeName ?? null,
        PublicationDate: book.AttributeSets[0].PublicationDate ?? null,
        Publisher: book.AttributeSets[0].Publisher ?? null,
        SmallImage: book.AttributeSets[0].SmallImage ?? null,
        Title: book.AttributeSets[0].Title ?? null,
        ...item.attributes,
      };
      await item.save();
      return res.send([item]);
    }

    //call sp-api 2020-12-01 by asin
    let result2 = await sellingPartner.callAPI({
      operation: "getCatalogItem",
      endpoint: "catalogItems",
      query: {
        marketplaceIds: [process.env.DEFAULT_MARKETPLACE_ID],
        includedData: [
          "attributes",
          "identifiers",
          "images",
          "productTypes",
          "salesRanks",
          "summaries",
          "variations",
        ],
      },
      options: {
        version: "2020-12-01",
      },
      path: {
        asin: book.Identifiers.MarketplaceASIN.ASIN,
      },
    });

    //find isbn
    // let isbn10 = await _.pick(
    //   _.find(result2.identifiers[0].identifiers, function (o) {
    //     return o.identifierType == "ISBN" && o.identifier.length == 10;
    //   }),
    //   "identifier"
    // ).identifier;

    // let isbn13 = await _.pick(
    //   _.find(result2.identifiers[0].identifiers, function (o) {
    //     return o.identifierType == "ISBN" && o.identifier.length == 13;
    //   }),
    //   "identifier"
    // ).identifier;

    let isbn10 = isbn.length == 10 ? isbn : null;
    let isbn13 = isbn.length == 13 ? isbn : null;

    //merge result of 2 calls
    // result[0].AttributeSets.ProductGroup : Book
    let newItem = new Item({
      isbn10: isbn10 ?? null,
      isbn13: isbn13 ?? null,
      asin: book.Identifiers.MarketplaceASIN.ASIN,
      attributes: {
        Author: book.AttributeSets[0].Author ?? null,
        Binding: book.AttributeSets[0].Binding ?? null,
        NumberOfPages: book.AttributeSets[0].NumberOfPages ?? null,
        ProductGroup: book.AttributeSets[0].ProductGroup ?? null,
        ProductTypeName: book.AttributeSets[0].ProductTypeName ?? null,
        PublicationDate: book.AttributeSets[0].PublicationDate ?? null,
        Publisher: book.AttributeSets[0].Publisher ?? null,
        SmallImage: book.AttributeSets[0].SmallImage ?? null,
        Title: book.AttributeSets[0].Title ?? null,
        ...result2.attributes,
      },
      identifiers: result2.identifiers,
      images: result2.images,
      productTypes: result2.productTypes,
      ranks: result2.ranks,
      salesRankings: result2.salesRanks,
      summaries: result2.summaries,
      variations: result2.variations,
    });

    await newItem.save();
    bookArr.push(newItem);
  }
  return res.send(bookArr);
});

module.exports = router;
