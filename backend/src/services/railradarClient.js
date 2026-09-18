const axios = require("axios");

const railradarClient = axios.create({
  baseURL: process.env.RAILRADAR_BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${process.env.RAILRADAR_API_KEY}`,
    Accept: "application/json",
  },
});

module.exports = railradarClient;