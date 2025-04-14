const _ = require("lodash");
let payload = require("./payload.json");
const moment = require("moment");

const predictionMapper = async (data) => {
  payload.instances[0].SalesRank = getSalesRank(data.item);
  //TODO:
  let conditionedPrices = getConditionedPrices(data.prices);
  payload.instances[0].SalesPrice = conditionedPrices["New"];
  payload.instances[0].ListingDate = moment(
    data.item.attributes.product_site_launch_date[0].value
  ).format("M/DD/YYYY hh:mm");
  payload.instances[0].Condition_New = "1";
  payload.instances[0].Condition_UsedAcceptable = "0";
  payload.instances[0].Condition_UsedGood = "0";
  payload.instances[0].Condition_UsedLikeNew = "0";
  payload.instances[0].Condition_UsedVeryGood = "0";
  payload.instances[0].attributesNumberOfPages =
    data.item.attributes.NumberOfPages;
  payload.instances[0].attributesPublicationDate = moment(
    data.item.attributes.PublicationDate
  ).format("YYYY-MM-DD");
  payload.instances[0].AttributesItemWeightGrams =
    data.item.attributes.item_weight[0].value;
  payload.instances[0].AttributesListPriceCAD =
    data.item.attributes.list_price[0].value;
  payload.instances[0].attributesBinding_AudioCassette =
    data.item.attributes.Binding == "AudioCassette" ? 1 : 0;
  payload.instances[0].attributesBinding_AudioCD =
    data.item.attributes.Binding == "AudioCD" ? 1 : 0;
  payload.instances[0].attributesBinding_Boardbook =
    data.item.attributes.Binding == "Boardbook" ? 1 : 0;
  payload.instances[0].attributesBinding_BondedLeather =
    data.item.attributes.Binding == "BondedLeather" ? 1 : 0;
  payload.instances[0].attributesBinding_CDROM =
    data.item.attributes.Binding == "CDROM" ? 1 : 0;
  payload.instances[0].attributesBinding_Cards =
    data.item.attributes.Binding == "Cards" ? 1 : 0;
  payload.instances[0].attributesBinding_DVD =
    data.item.attributes.Binding == "DVD" ? 1 : 0;
  payload.instances[0].attributesBinding_DVDROM =
    data.item.attributes.Binding == "DVDROM" ? 1 : 0;
  payload.instances[0].attributesBinding_Diary =
    data.item.attributes.Binding == "Diary" ? 1 : 0;
  payload.instances[0].attributesBinding_Digital =
    data.item.attributes.Binding == "Digital" ? 1 : 0;
  payload.instances[0].attributesBinding_Flexibound =
    data.item.attributes.Binding == "Flexibound" ? 1 : 0;
  payload.instances[0].attributesBinding_Hardcover =
    data.item.attributes.Binding == "Hardcover" ? 1 : 0;
  payload.instances[0].attributesBinding_Hardcoverspiral =
    data.item.attributes.Binding == "Hardcoverspiral" ? 1 : 0;
  payload.instances[0].attributesBinding_ImitationLeather =
    data.item.attributes.Binding == "ImitationLeather" ? 1 : 0;
  payload.instances[0].attributesBinding_Kitchen =
    data.item.attributes.Binding == "Kitchen" ? 1 : 0;
  payload.instances[0].attributesBinding_LeatherBound =
    data.item.attributes.Binding == "LeatherBound" ? 1 : 0;
  payload.instances[0].attributesBinding_LibraryBinding =
    data.item.attributes.Binding == "LibraryBinding" ? 1 : 0;
  payload.instances[0].attributesBinding_LooseLeaf =
    data.item.attributes.Binding == "LooseLeaf" ? 1 : 0;
  payload.instances[0].attributesBinding_MP3CD =
    data.item.attributes.Binding == "MP3CD" ? 1 : 0;
  payload.instances[0].attributesBinding_Map =
    data.item.attributes.Binding == "Map" ? 1 : 0;
  payload.instances[0].attributesBinding_MassMarketPaperback =
    data.item.attributes.Binding == "MassMarketPaperback" ? 1 : 0;
  payload.instances[0].attributesBinding_MiscSupplies =
    data.item.attributes.Binding == "MiscSupplies" ? 1 : 0;
  payload.instances[0].attributesBinding_Pamphlet =
    data.item.attributes.Binding == "Pamphlet" ? 1 : 0;
  payload.instances[0].attributesBinding_Paperback =
    data.item.attributes.Binding == "Paperback" ? 1 : 0;
  payload.instances[0].attributesBinding_PaperbackBunko =
    data.item.attributes.Binding == "PaperbackBunko" ? 1 : 0;
  payload.instances[0].attributesBinding_PerfectPaperback =
    data.item.attributes.Binding == "PerfectPaperback" ? 1 : 0;
  payload.instances[0].attributesBinding_PlasticComb =
    data.item.attributes.Binding == "PlasticComb" ? 1 : 0;
  payload.instances[0].attributesBinding_PocketBook =
    data.item.attributes.Binding == "PocketBook" ? 1 : 0;
  payload.instances[0].attributesBinding_PrintedAccessCode =
    data.item.attributes.Binding == "PrintedAccessCode" ? 1 : 0;
  payload.instances[0].attributesBinding_ProductBundle =
    data.item.attributes.Binding == "ProductBundle" ? 1 : 0;
  payload.instances[0].attributesBinding_Ringbound =
    data.item.attributes.Binding == "Ringbound" ? 1 : 0;
  payload.instances[0].attributesBinding_Sheetmusic =
    data.item.attributes.Binding == "Sheetmusic" ? 1 : 0;
  payload.instances[0].attributesBinding_Spiralbound =
    data.item.attributes.Binding == "Spiralbound" ? 1 : 0;
  payload.instances[0].attributesBinding_StapleBound =
    data.item.attributes.Binding == "StapleBound" ? 1 : 0;
  payload.instances[0].attributesBinding_TextbookBinding =
    data.item.attributes.Binding == "TextbookBinding" ? 1 : 0;
  payload.instances[0].attributesBinding_Turtleback =
    data.item.attributes.Binding == "Turtleback" ? 1 : 0;
  payload.instances[0].attributesBinding_Unbound =
    data.item.attributes.Binding == "Unbound" ? 1 : 0;
  payload.instances[0].attributesBinding_VinylBound =
    data.item.attributes.Binding == "VinylBound" ? 1 : 0;

  return payload;
};

const getSalesRank = (item) => {
  let result = _.find(item.salesRankings[0].ranks, {
    title: "Books",
  });
  return _.isEmpty(result) ? 0 : result.value;
};

const getConditionedPrices = (prices) => {
  let arrayPrices = [];
  _.forEach(prices, function (price) {
    key =
      price.condition == price.subcondition
        ? price.condition
        : price.condition + price.subcondition;
    arrayPrices[key] = price.Price.ListingPrice.Amount;
  });
  return arrayPrices;
};

module.exports = {
  predictionMapper,
};
