import React, { useEffect, useState, useLayoutEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import Button from "../components/AppButton";
import BookCard from "../components/BookCard";
import colors from "../config/colors";
import routes from "../navigation/routes";
import searchListing from "../api/search";
import Screen from "../components/Screen";
import useApi from "../hooks/useApi";

function SearchResultScreen({ navigation, route }) {
  const [value, onChangeText] = useState(route.params.title);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: value === "" ? "No title" : "Search Result for '" + value + "'",
    });
  }, [navigation, value]);

  const getSearchResult = useApi(searchListing.search);
  useEffect(() => {
    getSearchResult.request(route.params.title);
  }, []);
  return (
    <>
      <ActivityIndicator visible={getSearchResult.loading} />
      <Screen style={styles.screen}>
        <View style={styles.errorView}>
          {getSearchResult.error && (
            <>
              <AppText>Couldn't retrieve listings</AppText>
              <Button title="Retry" onPress={getSearchResult.request} />
            </>
          )}
          {getSearchResult.data.length == 0 && (
            <>
              <AppText>Couldn't find any item</AppText>
            </>
          )}
        </View>
        <FlatList
          data={getSearchResult.data}
          keyExtractor={(listing) =>
            listing.Identifiers.MarketplaceASIN.ASIN.toString()
          }
          renderItem={({ item }) => (
            <BookCard
              title={item.AttributeSets[0].Title}
              author={item.AttributeSets[0].Author}
              imageURL={item.AttributeSets[0].SmallImage.URL}
              onPress={() =>
                navigation.navigate(routes.BOOK_SUMMARY, {
                  asin: item.Identifiers.MarketplaceASIN.ASIN,
                  type: "search",
                  query: item.AttributeSets[0].Title,
                })
              }
              thumbnailUrl={item.AttributeSets[0].SmallImage.URL}
            />
          )}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  errorView: {
    margin: 20,
    alignItems: "center",
  },
  screen: {
    paddingTop: 2,
    paddingHorizontal: 2,
    backgroundColor: colors.light,
  },
});

export default SearchResultScreen;
