const auth = require("../middleware/auth");
const { Item } = require("../models/item");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const csv = require("fast-csv");
const upload = multer({ dest: "tmp/csv/" });
const SellingPartnerAPI = require("amazon-sp-api");
const { forEach } = require("lodash");
const _ = require("lodash");

router.post("/", auth, upload.single("file"), async (req, res) => {
  const fileRows = [];

  // open uploaded file
  csv
    .parseFile(req.file.path)
    .on("data", async function (data) {
      fileRows.push(data[0]); // push each row
    })
    .on("end", function () {
      fs.unlinkSync(req.file.path); // remove temp file
      //process "fileRows" and respond
      handleImport(fileRows);
      res.send(`Imported ${fileRows.length} ASIN`);
    });
});

function handleImport(data) {
  let notFound = 0;
  let found = 0;

  for (let i = 0; i < data.length; i++) {
    setTimeout(async () => {
      let sellingPartner = new SellingPartnerAPI({
        region: "na", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
        refresh_token: process.env.AWS_REFRESH_TOKEN, // The refresh token of your app user
      });

      try {
        let item = await Item.findOne({ asin: data[i] });
        if (!item) {
          // let result = await sellingPartner.callAPI({
          //   operation: "catalogItems.getCatalogItem",
          //   query: queryBuilder,
          //   options: {
          //     version: "2020-12-01",
          //     auto_request_throttled: true,
          //   },
          //   path: {
          //     asin: data[i],
          //   },
          // });

          let result = await sellingPartner.callAPI({
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
              asin: data[i],
            },
          });

          let isbn10 = await _.pick(
            _.find(result.identifiers[0].identifiers, function (o) {
              return o.identifierType == "ISBN" && o.identifier.length == 10;
            }),
            "identifier"
          ).identifier;

          let isbn13 = await _.pick(
            _.find(result.identifiers[0].identifiers, function (o) {
              return o.identifierType == "ISBN" && o.identifier.length == 13;
            }),
            "identifier"
          ).identifier;

          let isbn = isbn13 ?? isbn10 ?? null;

          //call sp-api v0 by isbn
          let isbnResult = await sellingPartner.callAPI({
            operation: "catalogItems.listCatalogItems",
            query: {
              MarketplaceId: process.env.DEFAULT_MARKETPLACE_ID,
              ISBN: isbn,
            },
            options: {
              version: "v0",
            },
          });

          //filter books only
          isbnResult = await _.find(isbnResult.Items, function (o) {
            return o.AttributeSets[0].ProductGroup == "Book";
          });

          let newItem = new Item({
            asin: result.asin,
            isbn10: isbn10,
            isbn13: isbn13,
            attributes: {
              Author: isbnResult.AttributeSets[0].Author ?? null,
              Binding: isbnResult.AttributeSets[0].Binding ?? null,
              NumberOfPages: isbnResult.AttributeSets[0].NumberOfPages ?? null,
              ProductGroup: isbnResult.AttributeSets[0].ProductGroup ?? null,
              ProductTypeName:
                isbnResult.AttributeSets[0].ProductTypeName ?? null,
              PublicationDate:
                isbnResult.AttributeSets[0].PublicationDate ?? null,
              Publisher: isbnResult.AttributeSets[0].Publisher ?? null,
              SmallImage: isbnResult.AttributeSets[0].SmallImage ?? null,
              Title: isbnResult.AttributeSets[0].Title ?? null,
              ...result.attributes,
            },
            identifiers: result.identifiers,
            images: result.images,
            productTypes: result.productTypes,
            ranks: result.ranks,
            salesRankings: result.salesRankings,
            summaries: result.summaries,
            variations: result.variations,
          });

          await newItem.save();
        }
        ++found;
        console.log(data[i]);
        console.log("total found so far= ", found);
      } catch (ex) {
        ++notFound;
        console.log("ASIN not found: ", data[i]);
        console.log("total not found so far= ", notFound);
      }
    }, i * 500);
  }
}

module.exports = router;
