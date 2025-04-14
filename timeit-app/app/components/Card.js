import React from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Text from "./Text";
import colors from "../config/colors";
import moment from "moment";

function Card({
  title,
  author,
  binding,
  price,
  currency,
  imageUrl,
  onPress,
  thumbnailUrl,
  predictionResult,
  timeToSell,
  showChevron = true,
  dateScan = null,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{title}</Text>
          {author && <Text style={styles.details}>by {author}</Text>}
          {binding && <Text style={styles.details}>Binding: {binding}</Text>}
          {price && (
            <Text style={styles.details}>
              Price: {currency}${price}
            </Text>
          )}
          {predictionResult && (
            <Text style={styles.details}>
              Prediction result: {predictionResult ? "Buy" : "Do not Buy"}
            </Text>
          )}
          {timeToSell && (
            <Text style={styles.details}>
              Time to sell: {timeToSell} day(s)
            </Text>
          )}
          {dateScan && (
            <Text style={styles.details}>
              Scanned on: {moment(dateScan).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          )}
        </View>
        {showChevron && (
          <MaterialCommunityIcons
            color={colors.medium}
            name="chevron-right"
            size={25}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    flexDirection: "row",
    marginBottom: 20,
    marginLeft: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  detailsContainer: {
    padding: 5,
    width: "70%",
    flex: 1,
    // backgroundColor: colors.black,
  },
  image: {
    height: 150,
    justifyContent: "center",
    margin: 10,
    resizeMode: "center",
    width: "30%",
  },
  details: {
    fontSize: 16,
  },
  title: {
    marginVertical: 5,
    fontWeight: "bold",
  },
});

export default Card;
