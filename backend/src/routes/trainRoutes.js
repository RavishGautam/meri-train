const express = require("express");

const {
  searchTrains,
  getLiveTrainStatus,
  getTrainRoute,
} = require("../controllers/trainController");

const router = express.Router();


// Search trains
router.get(
  "/search",
  searchTrains
);


// Live train status
router.get(
  "/:trainNumber/live",
  getLiveTrainStatus
);


// Complete train route
router.get(
  "/:trainNumber/route",
  getTrainRoute
);


module.exports = router;