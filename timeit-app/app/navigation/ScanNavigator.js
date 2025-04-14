import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import BookSummaryScreen from "../screens/BookSummaryScreen";
import BookDetailScreen from "../screens/BookDetailScreen";
import FeatureAndDetailScreen from "../screens/FeatureAndDetailScreen";
import OfferScreen from "../screens/OfferScreen";
import ListingsScreen from "../screens/ListingsScreen";
import ScanScreen from "../screens/ScanScreen";

const Stack = createStackNavigator();
function ScanNavigator(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          unmountOnBlur: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BookSummary"
        component={BookSummaryScreen}
        options={({ route }) => ({ title: route.params.title })}
        screenOptions={({ navigation }) => ({
          headerLeft: () => <CancelButton onPress={navigation.goBack} />,
        })}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={({ route }) => ({ title: route.params.title })}
        screenOptions={({ navigation }) => ({
          headerLeft: () => <CancelButton onPress={navigation.goBack} />,
        })}
      />
      <Stack.Screen
        name="FeatureAndDetail"
        component={FeatureAndDetailScreen}
        options={({ route }) => ({ title: "Feature & Details" })}
        screenOptions={({ navigation }) => ({
          headerLeft: () => <CancelButton onPress={navigation.goBack} />,
        })}
      />
      <Stack.Screen
        name="ViewOffer"
        component={OfferScreen}
        options={({ route }) => ({ title: "View Offers" })}
        screenOptions={({ navigation }) => ({
          headerLeft: () => <CancelButton onPress={navigation.goBack} />,
        })}
      />
      <Stack.Screen
        name="Listing"
        component={ListingsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
export default ScanNavigator;
