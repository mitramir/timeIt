const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const SellingPartnerAPI = require("amazon-sp-api");

router.post("/", auth, async (req, res) => {
  let sellingPartner = new SellingPartnerAPI({
    region: "na", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
    refresh_token: process.env.AWS_REFRESH_TOKEN,
  });
  let report_document = await sellingPartner.callAPI({
    operation: "getReportDocument",
    version: "2021-06-30",
    endpoint: "reports",
    path: {
      reportDocumentId:
        "amzn1.spdoc.1.3.d6a70477-456a-4bec-ac8b-b5c95a568616.TK86DLW6MABF.316", // retrieve the reportDocumentId from a "getReport" operation (when processingStatus of report is "DONE")
    },
  });
  let report = await sellingPartner.download(report_document, {
    json: true,
    // charset: "cp1252",
    file: "./report/report.json",
  });
  console.log(report);
});

module.exports = router;
