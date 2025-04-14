import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingsScreen from "../screens/ListingsScreen";
import BookSummaryScreen from "../screens/BookSummaryScreen";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator mode="card" screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="Listing"
      component={ListingsScreen}
      options={{ title: "Books" }}
    />
    <Stack.Screen
      name="BookSummary"
      component={BookSummaryScreen}
      options={{ title: "Book Details" }}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
