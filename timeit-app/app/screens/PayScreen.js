import { StyleSheet, View, Text, StatusBar } from "react-native";
import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import PayDaysPlan from "../components/PayDaysPlan";
import PayAsYouGoScreen from "./PayAsYouGoScreen";

const PayScreen = ({ route, navigation }) => {
  const amount = route.params.amount;
  const type = route.params.type;
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <StripeProvider publishableKey="pk_live_51LgbHbL0PQlfnXM2G73gLqz8z5FptXuhZaJdKMOsIc4kekKTXZw6cFftOHz7akf0KPJKf4lUqS9axpCBw2qmdEvd00iGBdMh69">
        {type == 1 && (
          <PayAsYouGoScreen
            navigation={navigation}
            amount={amount}
            type={type}
          />
        )}
        {type != 1 && (
          <PayDaysPlan navigation={navigation} amount={amount} type={type} />
        )}
      </StripeProvider>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default PayScreen;
