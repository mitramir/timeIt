import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import AppButton from "./AppButton";
import colors from "../config/colors";
import credit from "../api/credit";
import subscribeApi from "../api/subscribe";

function PayDaysPlan({ navigation, amount, type }) {
  const stripe = useStripe();
  const buyPlan = async () => {
    try {
      const finalAmount = parseInt(amount);
      const subscribeType = parseInt(type);
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
      const resultSubscribeApi = await subscribeApi.subscribe({
        type: subscribeType,
        payId: payId,
      });
      //   console.log(retrieve);
      console.log(subscribeType);
      console.log(resultSubscribeApi);
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Payment failed!");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.buyBox}>
        <TextInput
          placeholder={amount + " $"}
          keyboardType="numeric"
          style={styles.input}
          editable={false}
        />
        <AppButton color="yellow" title="Buy" onPress={buyPlan} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buyBox: {
    width: 150,
    padding: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    height: "100%",
  },
  input: {
    padding: 10,
    borderColor: colors.grayish,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default PayDaysPlan;
