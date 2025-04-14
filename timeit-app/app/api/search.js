import client from "./client";

const endpoint = "/search";

const search = (query) => client.post(endpoint, { query });

export default {
  search,
};
