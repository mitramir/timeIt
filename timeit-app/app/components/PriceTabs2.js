import React from "react";
import { View, StyleSheet } from "react-native";
import AppText from "./AppText";
import { Tab, Text, TabView } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

function PriceTabs2({ Product, status }) {
  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.container}>
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

        <TabView value={index} onChange={setIndex} animationType="timing">
          {Product.CompetitivePricing.CompetitivePrices.map((item, key) => (
            <TabView.Item key={key} style={styles.tabItem}>
              <View>
                <View style={styles.priceView}>
                  <AppText style={styles.priceText}>
                    Sales Ranking: {Product.SalesRankings[0].Rank}
                  </AppText>
                  <MaterialCommunityIcons
                    color={colors.light}
                    name="chevron-right"
                    size={25}
                  />
                </View>

                {item.Price.ListingPrice && (
                  <View style={styles.lastPriceView}>
                    <AppText style={styles.priceText}>
                      Listing Price: {item.Price.ListingPrice.CurrencyCode}
                      {"$ "}
                      {item.Price.ListingPrice.Amount}
                    </AppText>
                    <MaterialCommunityIcons
                      color={colors.light}
                      name="chevron-right"
                      size={25}
                    />
                  </View>
                )}
              </View>
            </TabView.Item>
          ))}
        </TabView>
      </View>

      {status !== "Success" && (
        <AppText style={styles.warning}>Price data not available!</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buyNotBuy: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.limegreen,
  },
  buyNotBuyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.white,
    height: 200,
  },
  tabContainer: {
    width: "50%",
  },
  tabItem: {
    width: "100%",
    height: 100,
    padding: 10,
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
    // paddingTop: 10,
  },
  warning: {
    backgroundColor: colors.yellow,
    fontSize: 14,
    padding: 5,
  },
});
export default PriceTabs2;
