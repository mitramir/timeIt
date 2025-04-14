import client from "./client";

const getPrice = (isbn) => {
  return client.post("/price", { isbn });
};

export default {
  getPrice,
};
