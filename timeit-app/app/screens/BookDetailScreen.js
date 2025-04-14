import React, { useEffect, useState, useLayoutEffect } from "react";
import { Image, View, StyleSheet, ScrollView } from "react-native";
import _ from "lodash";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import AppText from "../components/AppText";
import colors from "../config/colors";
import PriceTabs from "../components/PriceTabs";
import sellingEligibility from "../api/eligibility";
import Icon from "../components/Icon";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";
import bookPrice from "../api/price";

function BookDetailScreen({ navigation, route }) {
  const book_data = route.params.data;
  const book_rank = _.find(book_data.salesRankings[0].ranks, {
    title: "Books",
  });
  const prices = useApi(bookPrice.getPrice);
  useEffect(() => {
    prices.request(book_data.asin);
  }, []);
  const getEligibility = useApi(sellingEligibility.getEligibility);
  useEffect(() => {
    getEligibility.request(book_data.asin);
  }, []);

  // const [type, onChangeText] = useState(route.params.type);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: book_data.attributes.Title,
    });
  }, [navigation]);

  const [elgShow, setElgShow] = useState(true);
  const [offerShow, setOfferShow] = useState(true);

  const handleFnD = () => {
    navigation.navigate(routes.FEATURE_AND_DETAIL, {
      data: book_data,
    });
  };

  const handleEligibility = () => {
    setElgShow(!elgShow);
  };

  const handleOffer = () => {
    setOfferShow(!offerShow);
  };

  return (
    <ScrollView style={styles.container}>
      <AppText style={styles.title}>{book_data.attributes.Title}</AppText>
      <AppText style={styles.rank}>
        #
        <AppText style={styles.rankValue}>
          {book_rank ? book_rank.value : "-"}
        </AppText>{" "}
        in Books
      </AppText>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book_data.images[0].images[0].link }}
          style={styles.image}
        />
      </View>
      <View style={styles.priceRow}>
        {prices.data.length !== 0 && (
          <PriceTabs
            Product={prices.data.Product}
            status={prices.data.status}
            asin={prices.data.ASIN}
            predictionResult={prices.data.predictionResult}
            averageRank={prices.data.averageRank}
            timeToSell={prices.data.timeToSell}
            item={prices.data.item}
          />
        )}
      </View>
      <TouchableOpacity onPress={handleOffer} style={styles.row}>
        <View style={styles.rowHeader}>
          <AppText style={styles.title}>Number of Offers</AppText>
          <MaterialCommunityIcons
            color={colors.medium}
            name={offerShow ? "chevron-down" : "chevron-right"}
            size={25}
          />
        </View>
        {offerShow && (
          <View style={styles.offersItems}>
            {prices.data.length !== 0 &&
              prices.data.Product?.CompetitivePricing?.CompetitivePrices &&
              prices.data.Product.CompetitivePricing.NumberOfOfferListings.map(
                (item, key) => (
                  <AppText key={key} style={styles.offerText}>
                    {item.Count} {item.condition}
                  </AppText>
                )
              )}
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleEligibility} style={styles.row}>
        <View style={styles.rowHeader}>
          <AppText style={styles.title}>Selling Eligibility</AppText>
          <MaterialCommunityIcons
            color={colors.medium}
            name={elgShow ? "chevron-down" : "chevron-right"}
            size={25}
          />
        </View>
        {elgShow &&
          getEligibility.data.length !== 0 &&
          getEligibility.data.isEligibleForProgram && (
            <View style={styles.eligibilityMsg}>
              <Icon
                name="check-circle-outline"
                backgroundColor={colors.white}
                iconColor={colors.limegreen}
                size={40}
              />
              <AppText style={styles.text}>
                Eligible, You can sell this product.
              </AppText>
            </View>
          )}
        {elgShow &&
          getEligibility.data.length !== 0 &&
          !getEligibility.data.isEligibleForProgram && (
            <View style={styles.eligibilityMsg}>
              <Icon
                name="cancel"
                backgroundColor={colors.white}
                iconColor={colors.dan}
                size={40}
              />
              <AppText style={styles.text}>
                You cannot sell this product!
              </AppText>
            </View>
          )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFnD} style={styles.row}>
        <View style={styles.rowHeader}>
          <AppText style={styles.title}>Feature & Details</AppText>
          <MaterialCommunityIcons
            color={colors.medium}
            name="chevron-right"
            size={25}
          />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
  },

  eligibilityMsg: {
    flexDirection: "row",
    alignContent: "center",
  },
  image: {
    resizeMode: "contain",
    height: 350,
    width: 250,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  priceRow: {
    borderWidth: 1,
    borderColor: colors.grayish,
    marginTop: 10,
  },
  offersRow: {
    borderWidth: 1,
    borderColor: colors.grayish,
    backgroundColor: colors.white,
    paddingLeft: 5,
  },
  offersItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  rank: {
    paddingLeft: 5,
    fontSize: 16,
  },
  rankValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayish,
    padding: 10,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 2,
  },
  offerText: {
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    marginTop: 10,
  },
  title: {
    paddingLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});
export default BookDetailScreen;
