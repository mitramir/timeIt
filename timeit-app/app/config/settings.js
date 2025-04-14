import Constants from "expo-constants";

const settings = {
  dev: {
    // apiUrl: "http://192.168.178.47:3000/api",
    apiUrl: "https://timeit.herokuapp.com/api",
  },
  staging: {
    apiUrl: "https://timeit.herokuapp.com/api",
  },
  prod: {
    apiUrl: "https://timeit.herokuapp.com/api",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
