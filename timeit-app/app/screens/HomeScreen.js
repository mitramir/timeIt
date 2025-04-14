import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Button } from "react-native";

import useAuth from "../auth/useAuth";
import AppPicker from "../components/AppPicker";
import InfoBox from "../components/InfoBox";
import colors from "../config/colors";
import Chart from "../components/Chart";
import history from "../api/history";
import useApi from "../hooks/useApi";
import AppText from "../components/AppText";

function HomeScreen({ navigation }) {
  const timeItems = [
    {
      label: "Last 7 days",
      value: 0,
    },
    {
      label: "Last 4 weeks",
      value: 1,
    },
    {
      label: "Last 12 months",
      value: 2,
    },
  ];
  const { user, logOut } = useAuth();
  const [filterTime, setFilterTime] = useState(timeItems[0]);

  const handleFilterTime = (item) => {
    setFilterTime(item);
  };

  const getTodayInfo = useApi(history.getTodayInfo);
  useEffect(() => {
    getTodayInfo.request();
  }, []);

  const getMyChart = useApi(history.getMyChart);
  useEffect(() => {
    getMyChart.request();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.BoxContainer}>
        <View style={styles.container}>
          {getTodayInfo.data.length !== 0 && (
            <InfoBox
              title={getTodayInfo.data.total ?? 0}
              subTitle="Number of Scans today so far"
            />
          )}
        </View>

        <View style={styles.container}>
          {getTodayInfo.data.length !== 0 && (
            <InfoBox
              title={(getTodayInfo.data.rate ?? 0) + "%"}
              subTitle="Success rate today so far"
            />
          )}
        </View>
      </View>
      <View style={styles.filterContainer}>
        <AppText style={styles.pickerLabel}>Scan History:</AppText>
        <AppPicker
          items={timeItems}
          onSelectItem={(item) => handleFilterTime(item)}
          placeholder="Select"
          selectedItem={filterTime}
          width="50%"
        />
      </View>
      {getMyChart.data != "Access denied no token provided" &&
        getMyChart.data.length !== 0 && (
          <Chart timeData={filterTime} scanData={getMyChart.data} />
        )}
      {/* TODO: must check token */}
      {getMyChart.data == "Access denied no token provided" && (
        <Chart
          timeData={filterTime}
          scanData={{ result7days: [0, 0, 0, 0, 0, 0, 0] }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  BoxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    justifyContent: "space-between",
    width: "100%",
  },
  pickerLabel: {
    alignSelf: "center",
    paddingLeft: 20,
    fontSize: 16,
  },
});
export default HomeScreen;
