import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import AppText from "./AppText";
import { Tab, TabView } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import useApi from "../hooks/useApi";
import history from "../api/history";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function PriceTabs({
  Product,
  status,
  asin,
  predictionResult,
  timeToSell,
  averageRank,
  item,
}) {
  const [index, setIndex] = React.useState(0);

  const makeHistory = useApi(history.makeHistory);

  useEffect(() => {
    if (
      Product?.SalesRankings &&
      Product?.CompetitivePricing?.CompetitivePrices
    ) {
      makeHistory.request({
        asin: asin,
        price: Product.CompetitivePricing.CompetitivePrices,
        rank: Product.SalesRankings,
        result: predictionResult,
        timeToSell: timeToSell,
        item: item,
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      {Product?.CompetitivePricing?.CompetitivePrices?.length <= 0 && (
        <AppText style={styles.warning}>Price data not available!</AppText>
      )}
      {status !== "Success" && (
        <AppText style={styles.warning}>Price data not available!</AppText>
      )}
      {Product?.CompetitivePricing?.CompetitivePrices?.length > 0 && (
        <View style={styles.tabContainer}>
          <Tab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
              backgroundColor: colors.blue,
              height: 2,
            }}
            variant="default"
          >
            {Product.CompetitivePricing.CompetitivePrices.map((item, key) => (
              <Tab.Item
                key={key}
                title={item.condition}
                titleStyle={{
                  fontSize: 12,
                  color: colors.black,
                  fontWeight: "bold",
                }}
                type="outline"
                buttonStyle={{ backgroundColor: colors.white }}
              />
            ))}
          </Tab>
          {makeHistory.data.length !== 0 && (
            <TouchableWithoutFeedback onPress={() => {}}>
              <TabView value={index} onChange={setIndex} animationType="timing">
                {Product.CompetitivePricing.CompetitivePrices.map(
                  (item, key) => (
                    <TabView.Item key={key} style={styles.tabItem}>
                      <View>
                        <View style={styles.buyNotBuyContainer}>
                          <AppText
                            style={
                              makeHistory.data.result
                                ? styles.buyText
                                : styles.dotBuyText
                            }
                          >
                            {makeHistory.data.result ? "BUY" : "Do Not Buy"}
                          </AppText>
                        </View>

                        <View style={styles.priceView}>
                          <AppText style={styles.priceText}>
                            Ranking (*book display on website):{" "}
                            {Product.SalesRankings[0]
                              ? Product.SalesRankings[0].Rank
                              : "N/A"}
                          </AppText>
                        </View>

                        <View style={styles.priceView}>
                          <AppText style={styles.priceText}>
                            Average Ranking:{" "}
                            {averageRank && averageRank !== "-"
                              ? parseFloat(averageRank)
                              : Product?.SalesRankings[0]?.Rank ?? "N/A"}
                          </AppText>
                        </View>

                        <View style={styles.priceView}>
                          <AppText style={styles.priceText}>
                            Time To Sell: {parseInt(timeToSell)} days
                          </AppText>
                        </View>

                        {item.Price.ListingPrice && (
                          <View style={styles.lastPriceView}>
                            <AppText style={styles.priceText}>
                              Listing Price:{" "}
                              {item.Price.ListingPrice.CurrencyCode}
                              {"$ "}
                              {item.Price.ListingPrice.Amount}
                            </AppText>
                          </View>
                        )}
                      </View>
                    </TabView.Item>
                  )
                )}
              </TabView>
            </TouchableWithoutFeedback>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.limegreen,
  },
  dotBuyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.danger,
  },
  buyNotBuyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.white,
  },
  tabContainer: {
    // width: "100%",
  },
  tabItem: {
    width: "95%",
    padding: 10,
    height: 210,
  },
  priceView: {
    borderBottomWidth: 1,
    borderColor: colors.grayish,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 25,
    paddingTop: 10,
  },
  lastPriceView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 25,
    paddingTop: 10,
  },
  priceText: {
    fontSize: 14,
    paddingBottom: 10,
  },
  warning: {
    backgroundColor: colors.yellow,
    fontSize: 14,
    padding: 5,
  },
});
export default PriceTabs;
