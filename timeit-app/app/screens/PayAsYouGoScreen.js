import { StyleSheet, View, Text, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/stripe-react-native";
import credit from "../api/credit";
import subscribeApi from "../api/subscribe";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import { TextInput } from "react-native-gesture-handler";
import AppText from "../components/AppText";

function PayAsYouGoScreen({ navigation, amount, type }) {
  const [inputAmount, setInputAmount] = useState("1");
  const stripe = useStripe();

  const buyCredit = async () => {
    try {
      const finalAmount = parseInt(inputAmount);
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
        <AppText style={styles.label}>Please Enter Amount ($):</AppText>
        <TextInput
          placeholder="Amount"
          keyboardType="numeric"
          style={styles.input}
          value={inputAmount}
          onChangeText={(e) => setInputAmount(e)}
        />
        <AppButton color="yellow" title="Buy" onPress={buyCredit} />
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
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    padding: 10,
    borderColor: colors.grayish,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default PayAsYouGoScreen;
