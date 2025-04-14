import React from "react";
import { StyleSheet, View, Button } from "react-native";
import * as Google from "expo-google-app-auth";

const GoogleLoginScreen = ({ navigation }) => {
  const signInAsync = async () => {
    console.log("LoginScreen.js 6 | loggin in");
    try {
      const { type, user } = await Google.logInAsync({
        iosClientId:
          "959908856411-7uml0n45bjsbkli79pr7af5q7epvhphs.apps.googleusercontent.com",
        androidClientId:
          "959908856411-pb8l79ipvhg1v79qj27sbsnm3vu5ijss.apps.googleusercontent.com",
      });

      if (type === "success") {
        // Then you can use the Google REST API
        console.log("LoginScreen.js 17 | success, navigating to profile");
        navigation.navigate("Profile", { user });
      }
    } catch (error) {
      console.log("LoginScreen.js 19 | error with login", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Google" onPress={signInAsync} />
    </View>
  );
};

export default GoogleLoginScreen;

const styles = StyleSheet.create({});
