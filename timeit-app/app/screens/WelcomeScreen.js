import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen";

import Button from "../components/AppButton";
import AppText from "../components/AppText";
import colors from "../config/colors";
import routes from "../navigation/routes";

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.background}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/timeit-icon-2.png")}
        />
        <Text style={styles.tagline}>Time it to sell it faster</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          color="blackish"
          title="Login"
          onPress={() => navigation.navigate(routes.LOGIN)}
        />
        <Button
          color="grayish"
          title="Sign up"
          onPress={() => navigation.navigate(routes.REGISTER)}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate(routes.FORGOT_PASS)}
        >
          <AppText style={styles.forgotText}>Forgot Password?</AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsContainer}>
        {/* <Button
          color="blue"
          title="Login with Google"
          onPress={() => navigation.navigate("GoogleLogin")}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  buttonsContainer: {
    padding: 20,
    top: 150,
    width: "80%",
  },
  forgotText: {
    fontSize: 16,
    fontStyle: "italic",
    color: colors.blue,
  },
  logo: {
    width: 240,
    height: 80,
  },
  logoContainer: {
    position: "absolute",
    top: 230,
    alignItems: "center",
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
  },
});

export default WelcomeScreen;
