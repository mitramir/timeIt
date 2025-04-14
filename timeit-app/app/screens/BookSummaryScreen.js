import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import BookCard from "../components/BookCard";
import scanListing from "../api/scan";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";
import BookCardDetail from "../components/BookCardDetail";
import credit from "../api/credit";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

function BookSummaryScreen({ navigation, route }) {
  const getBook = useApi(scanListing.scanBook);
  useEffect(() => {
    getBook.request(route.params.asin);
  }, []);

  const canScan = useApi(credit.canScan);
  useEffect(() => {
    canScan.request();
  }, []);
  const [type, onChangeText] = useState(route.params.type);
  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        type === "scan"
          ? "ISBN: " + route.params.asin
          : "Book Summary: '" + route.params.query + "'",
    });
  }, [navigation]);

  // Check if there's only one item, automatically navigate to BOOK_DETAIL
  useEffect(() => {
    if (getBook.data.length === 1) {
      const item = getBook.data[0];
      if (item.attributes.list_price) {
        navigation.navigate(routes.BOOK_DETAIL, {
          data: item,
        });
      } else {
        Alert.alert("Unfortunately price data not available!");
      }
    }
  }, [getBook.data, navigation]);

  return (
    <>
      <ActivityIndicator visible={getBook.loading} />
      {canScan.data.length !== 0 && (
        <>
          {!canScan.data.result && (
            <Screen style={styles.screenError}>
              <AppText>{canScan.data.message}</AppText>

              <AppButton
                title="Check plans"
                onPress={() => navigation.openDrawer()}
              />
            </Screen>
          )}
          <Screen style={styles.screen}>
            <View style={styles.errorView}>
              {getBook.error && (
                <View>
                  <AppText>Couldn't retrieve listings</AppText>
                  <AppButton title="Retry" />
                </View>
              )}
              {getBook.data.length == 0 && (
                <AppText>This book is not available now!</AppText>
              )}
            </View>
            {getBook.data.length !== 0 && canScan.data.result && (
              <View>
                {getBook.data.length > 1 && (
                  <AppText style={styles.resultMsg}>
                    We have identified more results based on your scan/search.
                    Select the item you're interested in to view more.
                  </AppText>
                )}
                <FlatList
                  data={getBook.data}
                  keyExtractor={(listing) => listing.asin.toString()}
                  renderItem={({ item }) => (
                    <>
                      <BookCard
                        author={item.attributes.Author}
                        binding={item.attributes.Binding}
                        currency={
                          item.attributes.list_price
                            ? item.attributes.list_price[0].currency
                            : "-"
                        }
                        imageURL={item.attributes.SmallImage.URL}
                        onPress={() => {
                          if (item.attributes.list_price) {
                            navigation.navigate(routes.BOOK_DETAIL, {
                              data: item,
                            });
                          } else {
                            Alert.alert(
                              "Unfortunately price data not available!"
                            );
                          }
                        }}
                        price={
                          item.attributes.list_price
                            ? item.attributes.list_price[0].value.toString()
                            : "-"
                        }
                        showChevron="true"
                        title={item.attributes.Title}
                      />
                      <BookCardDetail
                        onPressViewOffer={() => {
                          navigation.navigate(routes.VIEW_OFFER, {
                            data: item,
                          });
                        }}
                        data={item}
                      />
                    </>
                  )}
                />
              </View>
            )}
          </Screen>
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  errorView: {
    alignItems: "center",
  },
  resultMsg: {
    padding: 20,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: colors.yellow,
  },
  screen: { paddingTop: 2 },
  screenError: {
    padding: 20,
    justifyContent: "center",
    alignContent: "center",
  },
});
export default BookSummaryScreen;
