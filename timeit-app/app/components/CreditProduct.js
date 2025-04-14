import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text, TextInput } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import AppButton from "./AppButton";
import credit from "../api/credit";
import colors from "../config/colors";

function CreditProduct({ amount, navigation }) {
  const stripe = useStripe();
  const buyCredit = async () => {
    try {
      const finalAmount = parseInt(amount);
      const buyRequest = await credit.buy({
        amount: finalAmount,
      });
      const data = buyRequest.data;
      if (buyRequest.error) {
        return Alert.alert(data.message);
      }
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "TimeIt App",
      });
      if (initSheet.error) {
        console.log("initSheet.error");
        return Alert.alert(initSheet.error.message);
      }
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret: data.clientSecret,
      });
      if (presentSheet.error) {
        console.log("presentSheet.error");
        return Alert.alert(presentSheet.error.message);
      }
      Alert.alert("Paid successfully! Thank you.");
      const clientSecretArray = data.clientSecret.split("_");
      const payId = clientSecretArray[0] + "_" + clientSecretArray[1];
      const retrieve = await credit.retrieve({ payId: payId });
      console.log(retrieve);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Payment failed!");
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <TextInput
          placeholder={amount + "$ Credit"}
          keyboardType="numeric"
          style={styles.input}
          enabled="false"
        />
        <AppButton color="yellow" title="Buy" onPress={buyCredit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    padding: 10,
  },
  input: {
    padding: 10,
    backgroundColor: colors.lightgray,
    borderColor: colors.grayish,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default CreditProduct;
