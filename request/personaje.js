const axios = require("axios");

const apiCallPersonaje = async (id) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://swapi.dev/api/people/${id}`,
    headers: {},
  };
  const result = await axios.request(config);
  return result.data;
};

module.exports.apiCallPersonaje = apiCallPersonaje;
