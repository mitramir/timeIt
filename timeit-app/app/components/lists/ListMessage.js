import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableHighlight } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";

import Text from "../Text";
import colors from "../../config/colors";

function ListMessage({
  title,
  subTitle,
  setImage,
  image,
  IconComponent,
  onPress,
  renderRightActions,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight
        underlayColor={colors.light}
        onPress={() => setIsOpen(!isOpen)}
      >
        <View style={styles.container}>
          {IconComponent}
          {image && <Image style={styles.image} source={{ uri: image }} />}
          {setImage && !image && (
            <Image
              style={styles.image}
              source={require("../../assets/profile.png")}
            />
          )}
          <MaterialCommunityIcons
            color={colors.medium}
            name={isOpen ? "chevron-down" : "chevron-right"}
            size={15}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subTitle && (
              <Text style={styles.subTitle} numberOfLines={isOpen ? 100 : 2}>
                {subTitle}
              </Text>
            )}
          </View>
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.medium,
  },
  title: {
    fontWeight: "500",
  },
});

export default ListMessage;
