const railradarClient = require("./railradarClient");

const getLiveTrainStatus = async (trainNumber) => {
  console.log("🚨 railradarService.getLiveTrainStatus CALLED");
  console.log("🚨 Train Number:", trainNumber);

  try {
    const response = await railradarClient.get(
      `/v1/trains/${encodeURIComponent(trainNumber)}/live`
    );

    console.log("🚨 RailRadar HTTP response received");
    console.log("🚨 Status:", response.status);
    console.log(
      "🚨 Response keys:",
      Object.keys(response.data || {})
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        "RailRadar API error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error(
        "RailRadar connection error:",
        error.message
      );
    }

    throw error;
  }
};

module.exports = {
  getLiveTrainStatus,
};