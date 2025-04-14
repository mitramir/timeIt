import client from "./client";

const getEligibility = (asin) => {
  return client.post("/eligibility", { asin });
};

export default {
  getEligibility,
};
