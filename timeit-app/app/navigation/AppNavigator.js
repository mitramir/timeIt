import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import AccountNavigator from "./AccountNavigator";
import HomeNavigator from "./HomeNavigator";
import Icon from "../components/Icon";
import colors from "../config/colors";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = createStackNavigator();
const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator
    screenOptions={{
      // headerStyle: { height: 100 },
      headerBackground: () => (
        <Image
          style={styles.homeHeaderLogo}
          source={require("../assets/timeit-icon-2-small.png")}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginBottom: 0 }}
          onPress={() => navigation.openDrawer()}
        >
          <Icon
            name="menu"
            size={50}
            backgroundColor={colors.white}
            iconColor={colors.black}
          />
        </TouchableOpacity>
      ),
    }}
  >
    <HomeStack.Screen
      name="Home Screen"
      component={HomeNavigator}
      options={{
        title: "",
      }}
    />
  </HomeStack.Navigator>
);

const AccountStack = createStackNavigator();
const AccountStackScreen = ({ navigation }) => (
  <AccountStack.Navigator
    screenOptions={{
      headerStyle: { height: 100 },
      headerRight: () => (
        <TouchableOpacity
          style={{ marginBottom: 0 }}
          onPress={() => navigation.openDrawer()}
        >
          <Icon
            name="menu"
            size={40}
            backgroundColor={colors.white}
            iconColor={colors.black}
          />
        </TouchableOpacity>
      ),
    }}
  >
    <AccountStack.Screen name="My Account" component={AccountNavigator} />
  </AccountStack.Navigator>
);

const AppNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    screenOptions={{
      drawerPosition: "right",
      headerShown: false,
    }}
  >
    <Drawer.Screen name="Home" component={HomeStackScreen} />
    <Drawer.Screen name="To My Account" component={AccountStackScreen} />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  homeHeaderLogo: {
    height: "100%",
    width: "100%",
  },
});

export default AppNavigator;
