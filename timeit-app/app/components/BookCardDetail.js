import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import _ from "lodash";

import colors from "../config/colors";
import defaultStyles from "../config/styles";
import Text from "./Text";

function BookCardDetail({ onPressViewOffer, data, price }) {
  const book_data = data;
  const book_rank = _.find(book_data.ranks[0].ranks, { title: "Books" });

  return (
    <View style={styles.container}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankLabel}>Sales Rank</Text>
        <Text style={styles.rank}>{book_rank ? book_rank.value : "N/A"}</Text>
      </View>

      {/* <TouchableWithoutFeedback onPress={onPressViewOffer}>
        <View style={styles.offerContainer}>
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={20}
            color={defaultStyles.colors.medium}
          />
          <Text style={styles.offer}>View Offers</Text>
        </View>
      </TouchableWithoutFeedback> */}

      {/* <View style={styles.addContainer}>
        <MaterialCommunityIcons
          name="tag-plus-outline"
          size={20}
          color={defaultStyles.colors.medium}
        />

        <Text style={styles.add}>Add to My List</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  add: {
    fontSize: 13,
    color: defaultStyles.colors.medium,
  },
  addContainer: {
    alignItems: "center",
    // backgroundColor: colors.yellow,
  },
  container: {
    padding: 10,
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  offer: {
    fontSize: 13,
    color: defaultStyles.colors.medium,
  },
  offerContainer: {
    alignItems: "center",
    left: 60,
    // backgroundColor: colors.blue,
  },

  rank: {
    fontSize: 14,
    fontWeight: "bold",
  },
  rankContainer: {
    // backgroundColor: colors.danger,
    color: defaultStyles.colors.medium,
    left: 10,
  },
  rankLabel: {
    fontSize: 12,
  },
});
export default BookCardDetail;
