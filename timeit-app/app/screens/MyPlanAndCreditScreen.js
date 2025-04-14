import React, { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import colors from "../config/colors";
import useApi from "../hooks/useApi";
import credit from "../api/credit";
import routes from "../navigation/routes";
import { FlatList } from "react-native-gesture-handler";
import PlanCard from "../components/PlanCard";
import Purchases from "react-native-purchases";
import PackageItem from "../components/PackageItem";

const APIKeys = {
  apple: "appl_hlsoCNqjIeLXwYtxiEiXMnxcXTU",
};
const ENTITLEMENT_ID = "default";

function MyPlanAndCreditScreen({ navigation }) {
  const getMyBalanceInfo = useApi(credit.myBalance);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMyBalanceInfo.request();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, getMyBalanceInfo.request]);

  const data = getMyBalanceInfo.data;

  const [currentOffering, setCurrentOffering] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await Purchases.configure({ apiKey: APIKeys.apple });

      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current);
    };

    setup().catch(console.log);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getMyBalanceInfo.request(); // Refresh your data
    setRefreshing(false);
  };

  const restorePurchases = async () => {
    setIsPurchasing(true);
    try {
      const purchaserInfo = await Purchases.restorePurchases();
      if (purchaserInfo.entitlements.active[ENTITLEMENT_ID]) {
        // The user has access to the purchased feature
        Alert.alert("Success", "Your purchase has been restored");
      } else {
        // The user doesn't have access to the purchased feature
        Alert.alert("Error", "No purchases to restore");
      }
    } catch (error) {
      setIsPurchasing(false);
      Alert.alert(error.message);
    }
    setIsPurchasing(false);
  };
  return (
    <Screen style={styles.screen}>
      {(getMyBalanceInfo.error || !data) && (
        <>
          <AppText>Couldn't retrieve data</AppText>
        </>
      )}
      <AppText style={styles.pulldown}>
        Pull down to refresh
        <MaterialCommunityIcons
          color={colors.medium}
          name={"refresh"}
          size={12}
        />
      </AppText>

      {data.length !== 0 && (
        <>
          {data.activeSubscriptions.length == 0 && (
            <AppText style={styles.warning}>
              You dont have a valid/active plan!
            </AppText>
          )}
          <FlatList
            data={data.activeSubscriptions}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <PlanCard item={item} />}
            extraData={data.activeSubscriptions}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </>
      )}
      <View style={styles.planContainer}>
        {Platform.OS == "android" && (
          <>
            <View style={styles.planBox}>
              <AppText style={styles.title}>Pay As You Go!</AppText>
              <View style={styles.hrLine} />
              <AppText style={styles.planText}>Fee:</AppText>
              <AppText style={styles.planSubText}>Up To You!</AppText>
              <AppText style={styles.planText}>Fee Per Scan:</AppText>
              <AppText style={styles.planSubText}>$ 0.10/Scan</AppText>
              <AppText style={styles.planText}>Scan Limit:</AppText>
              <AppText style={styles.planSubText}>-</AppText>
              <AppButton
                color="yellow"
                title="BUY"
                onPress={() =>
                  navigation.navigate(routes.PAYSCREEN, { amount: 0, type: 1 })
                }
                textStyle={{ fontSize: 14 }}
              />
            </View>
            <View style={styles.planBox}>
              <AppText style={styles.title}>30 Days Plan</AppText>
              <View style={styles.hrLine} />
              <AppText style={styles.planText}>Fee:</AppText>
              <AppText style={styles.planSubText}>60$</AppText>
              <AppText style={styles.planText}>Fee Per Scan:</AppText>
              <AppText style={styles.planSubText}>$ 0.03/Scan</AppText>
              <AppText style={styles.planText}>Scan Limit:</AppText>
              <AppText style={styles.planSubText}>2000</AppText>

              <AppButton
                color="yellow"
                title="BUY"
                onPress={() =>
                  navigation.navigate(routes.PAYSCREEN, { amount: 60, type: 2 })
                }
                textStyle={{ fontSize: 14 }}
              />
            </View>
            <View style={styles.planBox}>
              <AppText style={styles.title}>365 Days Plan</AppText>
              <View style={styles.hrLine} />
              <AppText style={styles.planText}>Fee:</AppText>
              <AppText style={styles.planSubText}>480$(40$ Monthly)</AppText>
              <AppText style={styles.planText}>Fee Per Scan:</AppText>
              <AppText style={styles.planSubText}>$ 0.02/Scan</AppText>
              <AppText style={styles.planText}>Scan Limit:</AppText>
              <AppText style={styles.planSubText}>24000</AppText>
              <AppButton
                color="yellow"
                title="BUY"
                onPress={() =>
                  navigation.navigate(routes.PAYSCREEN, {
                    amount: 480,
                    type: 3,
                  })
                }
                textStyle={{ fontSize: 14 }}
              />
            </View>
          </>
        )}
        {Platform.OS === "ios" && currentOffering && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isPurchasing ? (
              <ActivityIndicator size={200} color={colors.primary} />
            ) : (
              <View style={styles.purchaseView}>
                <View>
                  <FlatList
                    data={currentOffering.availablePackages}
                    keyExtractor={(item) => item.identifier}
                    renderItem={({ item }) => (
                      <PackageItem
                        purchasePackage={item}
                        setIsPurchasing={setIsPurchasing}
                      />
                    )}
                  />
                </View>
                <AppButton
                  color="yellow"
                  title="Restore My Purchases"
                  onPress={restorePurchases}
                  textStyle={{ fontSize: 12, fontWeight: "bold" }}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  planText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  planSubText: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  hrLine: {
    borderBottomColor: colors.black,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 5,
  },
  planBox: {
    width: "30%",
    height: 260,
    padding: 3,
    margin: 2,
    borderColor: colors.grayish,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
  planContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 430,
    marginTop: 20,
    backgroundColor: colors.light,
  },
  purchaseView: {
    paddingTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "90%",
  },
  screen: {
    paddingTop: 2,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    color: colors.blackish,
    fontWeight: "800",
    textAlign: "center",
    paddingTop: 20,
  },
  walletContainer: {
    backgroundColor: colors.yellow,
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  pulldown: {
    padding: 3,
    margin: 2,
    fontSize: 12,
    fontWeight: "400",
    shadowRadius: 5,
  },
  warning: {
    borderColor: colors.yellow,
    borderWidth: 2,
    borderRadius: 5,
    padding: 3,
    margin: 2,
    fontSize: 16,
    fontWeight: "500",
    shadowRadius: 5,
  },
});
export default MyPlanAndCreditScreen;
