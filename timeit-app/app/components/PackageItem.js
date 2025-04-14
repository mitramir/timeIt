import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import Purchases from "react-native-purchases";
import AppText from "./AppText";
import AppButton from "../components/AppButton";
import useAuth from "../auth/useAuth";

const ENTITLEMENT_ID = "default";

function PackageItem({ purchasePackage, setIsPurchasing }) {
  const {
    product: { title, description, priceString },
  } = purchasePackage;
  const { user, logOut } = useAuth();
  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      Purchases.setAttributes({ timeitId: user._id });
      const { purchaseInfo } = await Purchases.purchasePackage(purchasePackage);
      setIsPurchasing(false);
      if (
        typeof purchaseInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined"
      ) {
        console.log("user has default entitlement");
      }
    } catch (e) {
      if (e.userCancelled) {
        Alert.alert(e.message);
        setIsPurchasing(false);
      }
      setIsPurchasing(false);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePurchase}>
      <View style={styles.titleContainer}>
        <AppText style={styles.purchaseTitle}>{title}</AppText>
        <AppText style={styles.purchasePrice}>{priceString}</AppText>
      </View>
      <View style={styles.hrLine} />
      <View style={styles.buyContainer}>
        <AppText style={styles.purchaseDescription}>{description}</AppText>
        <View style={styles.btnContainer}>
          <AppButton
            color="yellow"
            title="BUY"
            onPress={handlePurchase}
            textStyle={{ fontSize: 12, fontWeight: "bold" }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default PackageItem;
const styles = StyleSheet.create({
  container: {
    margin: 4,
    borderColor: colors.grayish,
    borderWidth: 1,
    borderRadius: 5,
  },
  btnContainer: {
    width: "30%",
  },
  buyContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    height: 75,
    alignSelf: "center",
    alignItems: "center",
    borderColor: colors.danger,
    justifyContent: "space-between",
  },
  hrLine: {
    borderBottomColor: colors.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    paddingRight: 10,
  },
  purchaseDescription: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "400",
    textAlign: "center",
    paddingTop: 10,
  },
  purchasePrice: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "right",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});
