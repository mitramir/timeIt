import React from "react";
import { View, StyleSheet } from "react-native";

import colors from "../config/colors";
import Text from "./AppText";

function InfoBox({ title, subTitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: colors.lightgray,
    borderWidth: 2,
    margin: 5,
    padding: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
  },
  subTitle: {
    fontSize: 12,
  },
});
export default InfoBox;
