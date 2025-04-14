import client from "./client";

const makeHistory = (data) => client.post("/history", data);
const getTodayInfo = () => client.get("/history/info/today_scan");
const getMyList = () => client.get("/history/info/my_list");
const getMyChart = () => client.get("/history/info/my_chart");

export default {
  makeHistory,
  getTodayInfo,
  getMyList,
  getMyChart,
};
