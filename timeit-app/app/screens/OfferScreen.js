import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import Button from "../components/AppButton";
import Offer from "../components/Offer";
import Screen from "../components/Screen";
import useApi from "../hooks/useApi";
import bookPrice from "../api/price";

function OfferScreen({ navigation, route }) {
  const prices = useApi(bookPrice.getPrice);
  useEffect(() => {
    prices.request(route.params.data.asin);
  }, []);

  return (
    <>
      <ActivityIndicator visible={prices.loading} />
      <Screen style={styles.screen}>
        {prices.error && (
          <>
            <AppText>Couldn't retrieve Offers</AppText>
            <Button title="Retry" onPress={prices.request} />
          </>
        )}
        {prices.data.length !== 0 && (
          <Offer data={route.params.data} prices={prices.data} />
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 2 },
});
export default OfferScreen;
