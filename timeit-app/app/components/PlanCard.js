import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import React, { useState } from "react";
import colors from "../config/colors";
import AppText from "./AppText";
import subscribe from "../api/subscribe";
import moment from "moment";

function PlanCard({ item }) {
  const endDate = item.trialEnd ? item.trialEnd : item.endDate;
  const remainingDays = endDate
    ? moment(endDate).diff(moment(), "days") + 1 + " day(s)"
    : "--";
  const isPAYG = !item.trialEnd && item.plan.type == 1;
  const [planStatus, setPlanStatus] = useState(item.status);
  const handlePlanStatus = async () => {
    setPlanStatus(!planStatus);
    let data = {
      status: !planStatus,
      id: item._id,
    };
    const statusResult = await subscribe.subscribeStatus(data);
    Alert.alert(statusResult.data.status, statusResult.data.message, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  return (
    <View style={styles.info}>
      <View style={styles.infoRow}>
        <AppText style={styles.infoTitle}>Plan:</AppText>
        <AppText style={styles.infoValue}>
          {item.offer ? item.offer.name : item.plan.name}
        </AppText>
      </View>
      {!item.trialEnd && (
        <View style={styles.infoRow}>
          <AppText style={styles.infoTitle}>Fee Per Scan:</AppText>
          <AppText style={styles.infoValue}>{item.plan.feePerScan}$</AppText>
        </View>
      )}
      {isPAYG && (
        <View style={styles.infoRow}>
          <AppText style={styles.infoTitle}>Balance:</AppText>
          <AppText style={styles.infoValue}>{item.balance}$</AppText>
        </View>
      )}

      <View style={styles.infoRow}>
        <AppText style={styles.infoTitle}>Remaining Days:</AppText>
        <AppText style={styles.infoValue}>{remainingDays}</AppText>
      </View>
      <View style={styles.infoRow}>
        <AppText style={styles.infoTitle}>Remaining Scan:</AppText>
        {item.remainingScan > 0 && (
          <AppText style={styles.infoValue}>{item.remainingScan}</AppText>
        )}
        {item.remainingScan < 1 && (
          <AppText style={styles.infoValueWarning}>
            {item.remainingScan}
          </AppText>
        )}
      </View>
      <View style={styles.infoRow}>
        <AppText style={styles.infoTitle}>
          Status{planStatus ? " (Active)" : " (Deactive)"}
        </AppText>
        <Switch
          onValueChange={() => handlePlanStatus()}
          value={planStatus}
          trackColor={{ false: colors.grayish, true: colors.yellow }}
          ios_backgroundColor={colors.grayish}
          style={{
            transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
            marginTop: 0,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    padding: 10,
    borderColor: colors.grayish,
    width: 300,
    borderWidth: 3,
    borderRadius: 4,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    paddingLeft: 10,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "400",
    paddingRight: 10,
  },
  infoValueWarning: {
    fontSize: 14,
    fontWeight: "400",
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: colors.danger,
  },
});
export default PlanCard;
