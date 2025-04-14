import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import BookSummaryScreen from "../screens/BookSummaryScreen";
import BookDetailScreen from "../screens/BookDetailScreen";
import FeatureAndDetailScreen from "../screens/FeatureAndDetailScreen";
import OfferScreen from "../screens/OfferScreen";
import SearchScreen from "../screens/SearchScreen";
import SearchResultScreen from "../screens/SearchResultScreen";

const Stack = createStackNavigator();

const SearchNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { height: 40 },
      headerTitleStyle: {
        fontSize: 14,
      },
    }}
  >
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SearchResult"
      component={SearchResultScreen}
      options={({ route }) => ({ title: route.params.title })}
      screenOptions={({ navigation }) => ({
        headerLeft: () => <CancelButton onPress={navigation.goBack} />,
      })}
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
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {},
});
export default SearchNavigator;
