const railradarService = require("./railradarService");
const {normalizeTrainData,} = require("../utils/trainNormalizer");

const {getCachedTrain, setCachedTrain,} = require("../utils/trainCache");

// Existing mock search data
const mockTrains = [
  {
    trainNumber: "12951",
    trainName:
      "Mumbai Central - New Delhi Rajdhani Express",
    source: "Mumbai Central",
    destination: "New Delhi",
    departure: "17:00",
    arrival: "08:32",
    duration: "15h 32m",
    runningDays: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
  },
  {
    trainNumber: "12952",
    trainName:
      "New Delhi - Mumbai Central Rajdhani Express",
    source: "New Delhi",
    destination: "Mumbai Central",
    departure: "16:55",
    arrival: "08:35",
    duration: "15h 40m",
    runningDays: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
  },
  {
    trainNumber: "12009",
    trainName:
      "Mumbai Central - Ahmedabad Shatabdi Express",
    source: "Mumbai Central",
    destination: "Ahmedabad",
    departure: "06:25",
    arrival: "13:10",
    duration: "6h 45m",
    runningDays: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
  },
];


const searchTrains = async (query) => {
  const searchTerm = query.trim().toLowerCase();

  return mockTrains.filter((train) => {
    return (
      train.trainNumber
        .toLowerCase()
        .includes(searchTerm) ||
      train.trainName
        .toLowerCase()
        .includes(searchTerm) ||
      train.source
        .toLowerCase()
        .includes(searchTerm) ||
      train.destination
        .toLowerCase()
        .includes(searchTerm)
    );
  });
};


// Live train status
const getLiveTrainStatus = async (trainNumber) => {
  console.log(
    `🚆 Checking cache for train ${trainNumber}`
  );

  // --------------------------------------------
  // 1. Check cache
  // --------------------------------------------

  const cachedTrain =
    getCachedTrain(trainNumber);

  if (cachedTrain) {
    console.log(
      `⚡ Cache HIT: ${trainNumber}`
    );

    return cachedTrain;
  }


  // --------------------------------------------
  // 2. Cache miss → RailRadar
  // --------------------------------------------

  console.log(
    `🌐 Cache MISS: Fetching RailRadar for ${trainNumber}`
  );

  const rawResponse =
    await railradarService.getLiveTrainStatus(
      trainNumber
    );


  // --------------------------------------------
  // 3. Normalize response
  // --------------------------------------------

  const normalizedData =
    normalizeTrainData(rawResponse);


  // --------------------------------------------
  // 4. Store in cache
  // --------------------------------------------

  setCachedTrain(
    trainNumber,
    normalizedData
  );

  console.log(
    `💾 Train ${trainNumber} stored in cache`
  );


  return normalizedData;
};


module.exports = {
  searchTrains,
  getLiveTrainStatus,
};