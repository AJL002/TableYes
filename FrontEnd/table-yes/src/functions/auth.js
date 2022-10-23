const axios = require("axios");
axios.defaults.baseURL =
  "https://rrz0qonpwi.execute-api.us-east-1.amazonaws.com/dev/api";

// Signup a new user
exports.signup = async (data) => {
  return axios("/signup", {
    method: "POST",
    data,
  });
};

// Login a user
exports.login = async (data) => {
  return axios("/login", {
    method: "POST",
    data,
  });
};
