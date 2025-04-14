import client from "./client";

const register = (userInfo) => {
  return client.post("/users", userInfo);
};

const me = () => client.get("/users/me");
const uploadAvatar = (profilePhoto) =>
  client.post("/users/avatar", { profilePhoto });
const deleteAccount = () => {
  return client.post("/users/delete");
};

export default { register, me, uploadAvatar, deleteAccount };
