require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
  normalizeTrainData,
} = require("../src/utils/trainNormalizer");

// Load the original RailRadar response
const filePath = path.join(
  __dirname,
  "12951-live.json"
);

if (!fs.existsSync(filePath)) {
  console.error("❌ 12951-live.json not found.");
  console.error(`Expected location: ${filePath}`);
  process.exit(1);
}

try {
  const rawJson = fs.readFileSync(
    filePath,
    "utf8"
  );

  const originalResponse = JSON.parse(rawJson);

  const normalizedData =
    normalizeTrainData(originalResponse);

  console.log("\n================================");
  console.log(" MERI TRAIN NORMALIZER TEST");
  console.log("================================\n");

  console.log(
    "Train Number:",
    normalizedData.trainNumber
  );

  console.log(
    "Train Name:",
    normalizedData.trainName
  );

  console.log(
    "Status:",
    normalizedData.status
  );

  console.log(
    "Raw Status:",
    normalizedData.rawStatus
  );

  console.log(
    "Live:",
    normalizedData.isLive
  );

  console.log(
    "Tracking Mode:",
    normalizedData.trackingMode
  );

  console.log(
    "Source:",
    normalizedData.source
  );

  console.log(
    "Destination:",
    normalizedData.destination
  );

  console.log(
    "Current Location:",
    normalizedData.currentLocation
  );

  console.log(
    "Next Halt:",
    normalizedData.nextHalt
  );

  console.log(
    "Distance:",
    normalizedData.distanceKm,
    "km"
  );

  console.log(
    "Duration:",
    normalizedData.durationMinutes,
    "minutes"
  );

  console.log(
    "Average Speed:",
    normalizedData.avgSpeedKmh,
    "km/h"
  );

  console.log(
    "Maximum Speed:",
    normalizedData.maxSpeedKmh,
    "km/h"
  );

  console.log(
    "Total Halts:",
    normalizedData.totalHalts
  );

  console.log(
    "Route Stations:",
    normalizedData.route.length
  );

  console.log("\nFirst Route Station:");
  console.log(normalizedData.route[0]);

  console.log("\nLast Route Station:");
  console.log(
    normalizedData.route[
      normalizedData.route.length - 1
    ]
  );

  console.log("\n================================");

  // Basic validation
  const checks = [
    {
      name: "Train number",
      passed: normalizedData.trainNumber === "12951",
    },
    {
      name: "Train name",
      passed: Boolean(normalizedData.trainName),
    },
    {
      name: "Source code",
      passed: normalizedData.source?.code === "MMCT",
    },
    {
      name: "Source name",
      passed:
        normalizedData.source?.name ===
        "Mumbai Central",
    },
    {
      name: "Destination code",
      passed:
        normalizedData.destination?.code === "NDLS",
    },
    {
      name: "Destination name",
      passed:
        normalizedData.destination?.name ===
        "New Delhi",
    },
    {
      name: "Route count",
      passed: normalizedData.route.length === 214,
    },
    {
      name: "Current station",
      passed:
        normalizedData.currentLocation
          ?.stationCode === "MMCT",
    },
    {
      name: "Next halt",
      passed:
        normalizedData.nextHalt
          ?.stationCode === "BVI",
    },
  ];

  console.log("\nVALIDATION RESULTS");
  console.log("==================");

  let allPassed = true;

  checks.forEach((check) => {
    console.log(
      `${check.passed ? "✅" : "❌"} ${check.name}`
    );

    if (!check.passed) {
      allPassed = false;
    }
  });

  console.log(
    `\n${allPassed
      ? "✅ ALL TESTS PASSED"
      : "❌ SOME TESTS FAILED"}\n`
  );

  if (!allPassed) {
    process.exit(1);
  }
} catch (error) {
  console.error("\n❌ Normalizer test failed.");
  console.error(error.message);
  process.exit(1);
}