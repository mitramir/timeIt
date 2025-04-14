import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ForgotPassScreen from "../screens/ForgotPassScreen";
import GoogleLoginScreen from "../screens/GoogleLoginScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "" }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: "" }}
    />
    <Stack.Screen
      name="ForgotPass"
      component={ForgotPassScreen}
      options={{ title: "" }}
    />
    <Stack.Screen
      name="GoogleLogin"
      component={GoogleLoginScreen}
      options={{ title: "" }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
