import React from "react";
import { BarChart } from "react-native-chart-kit";
import moment from "moment";

import { Text, StyleSheet, Dimensions } from "react-native";
import colors from "../config/colors";

function Chart({ timeData, scanData }) {
  let data;
  let barSize = 1;
  switch (timeData.value) {
    case 0:
      let daysAgo_7 = [];
      for (var i = 6; i >= 0; i--) {
        daysAgo_7.push(moment().subtract(i, "days").format("DD/MM"));
      }
      data = {
        labels: daysAgo_7,
        datasets: [
          {
            data: scanData.result7days,
          },
        ],
      };
      barSize = 0.8;
      break;
    case 1:
      data = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
          {
            data: scanData.result30days,
          },
        ],
      };
      barSize = 0.8;
      break;
    case 2:
      let monthAgo_12 = [];
      for (var i = 11; i >= 0; i--) {
        monthAgo_12.push(moment().subtract(i, "month").format("MMM"));
      }
      data = {
        labels: monthAgo_12,
        datasets: [
          {
            data: scanData.result12Months,
          },
        ],
      };
      barSize = 0.4;
      break;
    default:
      data = {
        labels: ["1", "2", "3", "4", "5", "6", "7"],
        datasets: [
          {
            data: [10, 20, 30, 40, 50, 60, 70],
          },
        ],
      };
  }

  return (
    <>
      <Text style={styles.header}>Scan History</Text>
      <BarChart
        data={data}
        width={Dimensions.get("window").width - 20}
        height={300}
        yAxisLabel={""}
        // verticalLabelRotation={30}
        segments={Math.max(...data.datasets[0].data)}
        xLabelsOffset={-10}
        yLabelsOffset={30}
        chartConfig={{
          backgroundGradientFrom: colors.white,
          backgroundGradientTo: colors.white,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
          style: {
            borderRadius: 4,
          },
          fillShadowGradientOpacity: 1,
          fillShadowGradientFrom: colors.yellow,
          fillShadowGradientFromOffset: 1,
          fillShadowGradientToOffset: 1,
          barPercentage: barSize,
        }}
        style={{
          marginVertical: 5,
          borderRadius: 2,
        }}
      />
    </>
  );
}

export default Chart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});
