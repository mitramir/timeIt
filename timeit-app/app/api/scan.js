import client from "./client";

const scanBook = (isbn) => {
  return client.post("/scan", { isbn });
};

export default {
  scanBook,
};
