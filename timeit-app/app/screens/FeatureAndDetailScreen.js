import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../components/AppText";
import colors from "../config/colors";

function FeatureAndDetailScreen({ navigation, route }) {
  const data = route.params.data;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: data.attributes?.SmallImage.URL }}
          style={styles.image}
        />
        <AppText style={styles.title} numberOfLines={1}>
          {data.attributes?.Title}
        </AppText>
      </View>
      <View style={styles.separator1} />
      <View style={styles.rankSection}>
        <AppText style={styles.rankTitle}>Sales Rank:</AppText>
        {data.ranks[0]?.ranks[0]?.value && (
          <AppText style={styles.rankValue}>
            #{data.ranks[0]?.ranks[0]?.value} in{" "}
            {data.ranks[0]?.ranks[0]?.title}
          </AppText>
        )}
      </View>
      <View style={styles.separator2} />
      <View style={styles.featureSection}>
        <AppText style={styles.featureHeader}>Features</AppText>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons
            color={colors.yellow}
            name="circle"
            size={10}
          />
          <AppText style={styles.details}>{data.attributes?.Binding}</AppText>
        </View>

        <AppText style={styles.featureHeader}>Product Details</AppText>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons
            color={colors.yellow}
            name="circle"
            size={10}
          />
          <AppText style={styles.details}>
            Product Dimensions:{" "}
            {data.attributes?.item_dimensions?.[0]?.width?.value ?? "N/A"} x{" "}
            {data.attributes?.item_dimensions?.[0]?.length?.value ?? "N/A"} x{" "}
            {data.attributes?.item_dimensions?.[0]?.height?.value ?? "N/A"}{" "}
            {data.attributes?.item_dimensions?.[0]?.height?.unit ?? "N/A"}
          </AppText>
        </View>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons
            color={colors.yellow}
            name="circle"
            size={10}
          />
          <AppText style={styles.details}>
            Product Weight: {data.attributes?.item_weight?.[0]?.value ?? "N/A"}{" "}
            {data.attributes?.item_weight?.[0]?.unit ?? "N/A"}
          </AppText>
        </View>
        <View style={styles.detailsRow}>
          <MaterialCommunityIcons
            color={colors.yellow}
            name="circle"
            size={10}
          />
          <AppText style={styles.details}>ASIN: {data.asin ?? "N/A"}</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  details: {
    fontSize: 14,
    paddingLeft: 10,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  featureHeader: {
    fontSize: 15,
    color: colors.medium,
    fontWeight: "bold",
  },
  featureSection: {
    backgroundColor: colors.white,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    width: "auto",
    backgroundColor: colors.white,
    paddingVertical: 5,
  },
  image: {
    height: 75,
    justifyContent: "center",
    marginLeft: 20,
    width: 49,
  },
  rankSection: {
    backgroundColor: colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  rankTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.medium,
  },
  rankValue: {
    fontSize: 15,
    color: colors.medium,
  },
  separator1: {
    borderBottomColor: colors.grayish,
    borderBottomWidth: 2,
  },
  separator2: {
    borderBottomColor: colors.grayish,
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    flex: 1,
    paddingLeft: 10,
    paddingTop: 30,
  },
});
export default FeatureAndDetailScreen;
