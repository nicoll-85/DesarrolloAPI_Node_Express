const axios = require("axios");

const config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://swapi.dev/api/people/",
  headers: {},
};

const apiCallPersonajes = async () => {
  const result = await axios.request(config);
  return result.data;
};

module.exports.apiCallPersonajes = apiCallPersonajes;
