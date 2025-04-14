import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MyPlanAndCreditScreen from "../screens/MyPlanAndCreditScreen";
import MyListingsScreen from "../screens/MyListingsScreen";
import PayScreen from "../screens/PayScreen";
import MyProfileScreen from "../screens/MyProfileScreen";
import DeleteMyAccountScreen from "../screens/DeleteMyAccountScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Account"
      component={AccountScreen}
      options={{ headerShown: false, unmountOnBlur: true }}
    />
    <Stack.Screen
      name="MyProfileScreen"
      component={MyProfileScreen}
      options={{
        title: "",
        headerLeftLabelVisible: false,
        unmountOnBlur: true,
      }}
    />
    <Stack.Screen
      name="MyPlanAndCreditScreen"
      component={MyPlanAndCreditScreen}
      options={{ title: "Plans and Credit", headerLeftLabelVisible: false }}
    />
    <Stack.Screen
      name="PayScreen"
      component={PayScreen}
      options={{ title: "" }}
    />
    <Stack.Screen
      name="MyListings"
      component={MyListingsScreen}
      options={{
        title: "My List",
        headerLeftLabelVisible: false,
      }}
    />
    <Stack.Screen
      name="MyMessages"
      component={MessagesScreen}
      options={{
        title: "My Messages",
        headerLeftLabelVisible: false,
      }}
    />
    <Stack.Screen
      name="DeleteMyAccountScreen"
      component={DeleteMyAccountScreen}
      options={{
        title: "Account Deletion",
        headerLeftLabelVisible: false,
        unmountOnBlur: true,
      }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;
