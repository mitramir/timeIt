const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    //set timeit_jwtPrivateKey=tempPrivateKey
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }

  //configuration
  //set NODE_ENV=production&&node index.js
  // console.log("Application name: " + config.get("name"));
  //console.log("Application mail server: " + config.get("mail.host"));
  //set nodeapp_password=123
  // console.log("Application password: " + config.get("mail.password"));
};
