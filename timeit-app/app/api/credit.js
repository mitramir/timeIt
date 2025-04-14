import client from "./client";

const buy = (data) => client.post("/credit/buy", data);
const myBalance = () => client.get("/credit/mybalance");
const retrieve = (data) => client.post("/credit/retrieve", data);
const canScan = () => client.get("/credit/canScan");

export default {
  buy,
  myBalance,
  retrieve,
  canScan,
};
