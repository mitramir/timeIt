import client from "./client";

const passwordReset = (email) => {
  return client.post("/password_reset", { email });
};

export default {
  passwordReset,
};
