import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-elements";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import Constants from "expo-constants";
import Text from "../components/AppText";
import routes from "../navigation/routes";
import colors from "../config/colors";

const { width } = Dimensions.get("window");
const bqSize = width * 0.7;

function ScanScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setScanned(false);
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, setScanned]);

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    }
    if (Platform.OS === "android") {
      Linking.openSettings();
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setScannedData(data);

    // Load the sound file
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("../assets/beep.mp3"));
      await soundObject.playAsync();
      navigation.navigate(routes.BOOK_SUMMARY, {
        asin: data,
        type: "scan",
        query: "",
      });
    } catch (error) {
      console.warn(error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>No access to camera!</Text>
        <Button
          style={styles.warningBtn}
          title="Open Settings"
          onPress={openAppSettings}
        />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      />
      <LottieView
        autoPlay
        loop
        source={require("../assets/animations/scanner.json")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    alignItems: "center",
  },
  button: {
    fontWeight: "500",
    backgroundColor: colors.blue,
    marginBottom: 20,
  },
  barcode: {
    marginTop: "20%",
    marginBottom: "20%",
    width: bqSize,
    height: bqSize,
  },
  description: {
    fontSize: width * 0.09,
    marginTop: "10%",
    textAlign: "center",
    width: "70%",
    color: "white",
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: "center",
    width: "70%",
    color: "white",
  },
  warningContainer: {
    alignItems: "center",
    backgroundColor: colors.danger,
    height: 150,
    justifyContent: "center",
    position: "absolute",
    top: Constants.statusBarHeight,
    width: "100%",
    zIndex: 1,
  },
  warningBtn: {
    paddingTop: 20,
  },
  warningText: {
    color: colors.white,
  },
});

export default ScanScreen;
