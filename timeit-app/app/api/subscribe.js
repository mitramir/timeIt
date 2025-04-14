import client from "./client";

const endpoint = "/subscribe";

const subscribe = (data) => client.post(endpoint, data);
const subscribeStatus = (data) => client.post(endpoint + "/status", data);

export default {
  subscribe,
  subscribeStatus,
};
