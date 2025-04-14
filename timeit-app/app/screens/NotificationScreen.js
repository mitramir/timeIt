import React from "react";
import { Button, StyleSheet } from "react-native";

import AppText from "../components/AppText";
import Screen from "../components/Screen";

function NotificationScreen(props) {
  return (
    <Screen style={styles.container}>
      <AppText>No New Notification</AppText>
      <Button title="Refresh" onPress={() => console.log("notification")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
export default NotificationScreen;
