import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";

// import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/AppButton";
import Card from "../components/Card";
import colors from "../config/colors";
import listingApi from "../api/history";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import useApi from "../hooks/useApi";

function MyListingsScreen({ navigation }) {
  const [page, setPage] = useState(1); // Current page
  const [loadingMore, setLoadingMore] = useState(false); // Loading indicator for loading more data
  const [data, setData] = useState([]); // Data received from the API

  useEffect(() => {
    const fetchData = async () => {
      // Make an API request to get data for the current page
      const response = await listingApi.getMyList({ page });

      if (page === 1) {
        setData(response.data.items); // For the first page, set the data
      } else {
        setData([...data, ...response.data.items]); // Append data for subsequent pages
      }

      setLoadingMore(false);
    };

    fetchData();
  }, [page]);

  const loadMoreData = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setPage(page + 1); // Load the next page
    }
  };
  return (
    <>
      <Screen style={styles.screen}>
        {data.error && (
          <>
            <AppText>Couldn't retrieve listings</AppText>
            <Button title="Retry" onPress={data.request} />
          </>
        )}
        <FlatList
          data={data}
          keyExtractor={(listing, index) => listing._id.toString() + index}
          renderItem={({ item }) => (
            <Card
              title={item.item.attributes.Title}
              price={item.price[0].Price.ListingPrice.Amount}
              imageUrl={item.item.images[0].images[0].link}
              binding={item.item.attributes.binding[0].value}
              predictionResult={item.result}
              timeToSell={parseInt(item.timeToSell)}
              showChevron={false}
              dateScan={item.dateScan}
            />
          )}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : null
          }
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default MyListingsScreen;
