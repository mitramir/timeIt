import React from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import defaultStyles from "../config/styles";
import AppText from "./AppText";
import PriceTabs2 from "../components/PriceTabs2";

function Offer({ data, prices }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: data.attributes.SmallImage.URL }}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <AppText style={styles.title} numberOfLines={1}>
            {data.attributes.Title}
          </AppText>
          <AppText style={styles.bookDetails}>
            by {data.attributes.Author[0]}
          </AppText>
          <AppText style={styles.bookDetails}>
            {data.attributes.ProductGroup}
          </AppText>
          <AppText style={styles.bookDetails}>Buy Box Price: -</AppText>
          <AppText style={styles.bookDetails}>
            Sales Rank: {prices.Product.SalesRankings[0].Rank}
          </AppText>
        </View>
      </View>
      <View style={styles.separator1} />
      <PriceTabs2 Product={prices.Product} status={prices.status} />

      <View style={styles.featureSection}>
        <AppText>
          {prices.Product.CompetitivePricing.NumberOfOfferListings[0].Count}
          {prices.Product.CompetitivePricing.NumberOfOfferListings[0].condition}
        </AppText>
        <AppText>
          {prices.Product.CompetitivePricing.NumberOfOfferListings[1].Count}
          {prices.Product.CompetitivePricing.NumberOfOfferListings[1].condition}
        </AppText>
        <AppText>
          {prices.Product.CompetitivePricing.NumberOfOfferListings[2].Count}
          {prices.Product.CompetitivePricing.NumberOfOfferListings[2].condition}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookDetails: {
    fontSize: 12,
    flex: 1,
  },
  container: {
    flexDirection: "column",
  },
  details: {
    fontSize: 14,
    paddingLeft: 10,
  },
  detailsContainer: {
    flexDirection: "column",
    paddingLeft: 10,
    flex: 1,
  },

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  featureHeader: {
    fontSize: 15,
    color: colors.medium,
    fontWeight: "bold",
  },
  featureSection: {
    backgroundColor: colors.white,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    width: "auto",
    backgroundColor: colors.white,
    paddingVertical: 5,
  },
  image: {
    height: 120,
    justifyContent: "center",
    marginLeft: 20,
    resizeMode: "center",
    width: 65,
  },
  separator1: {
    borderBottomColor: colors.grayish,
    borderBottomWidth: 2,
  },
  separator2: {
    borderBottomColor: colors.grayish,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
    // paddingTop: 20,
  },
});
export default Offer;
