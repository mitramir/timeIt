import React from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

import Screen from "./Screen";
import Text from "./Text";
import AppText from "./AppText";

function BookCard({
  author,
  binding = null,
  currency = null,
  imageURL,
  onPress,
  price = null,
  showChevron = false,
  title,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: imageURL }} style={styles.image} />

        <View style={styles.detailsContainer}>
          {title && <AppText style={styles.title}>{title}</AppText>}
          {author && <Text style={styles.description}>by {author}</Text>}
          {binding && <Text style={styles.description}>{binding}</Text>}
          {price && (
            <Text style={styles.price}>
              Price: {currency}
              {"$ "}
              {price}
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
  container: {
    backgroundColor: colors.white,
    flexDirection: "row",
    marginBottom: 5,
    overflow: "hidden",
    alignItems: "center",
  },
  description: {
    fontSize: 14,
  },
  detailsContainer: {
    paddingRight: 10,
    flex: 1,
  },
  image: {
    height: 120,
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
  },
  price: {
    fontSize: 15,
    // marginVertical: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default BookCard;
