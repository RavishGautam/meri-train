const railwayApiService = require("../services/railwayApiService");


// ============================================
// SEARCH TRAINS
// ============================================

const searchTrains = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a train number or train name.",
      });
    }

    const trains =
      await railwayApiService.searchTrains(q);

    return res.status(200).json({
      success: true,
      count: trains.length,
      data: trains,
    });
  } catch (error) {
    console.error(
      "Train search error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to search trains at the moment.",
    });
  }
};


// ============================================
// LIVE TRAIN STATUS
// ============================================

const getLiveTrainStatus = async (req, res) => {
  try {
    const { trainNumber } = req.params;

    if (
      !trainNumber ||
      !/^\d+$/.test(trainNumber)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid train number.",
      });
    }

    console.log(
      `🚆 Live status requested: ${trainNumber}`
    );

    const train =
      await railwayApiService.getLiveTrainStatus(
        trainNumber
      );

    /*
     * Return only the information required
     * for the live train summary.
     *
     * Complete route is intentionally excluded.
     */
    const liveData = {
      trainNumber: train.trainNumber,

      trainName: train.trainName,

      startDate: train.startDate,

      lastUpdatedAt:
        train.lastUpdatedAt,

      status: train.status,

      rawStatus: train.rawStatus,

      isLive: train.isLive,

      trackingMode:
        train.trackingMode,

      delayMinutes:
        train.delayMinutes,

      trainType:
        train.trainType,

      category:
        train.category,

      source: train.source,

      destination:
        train.destination,

      runDays:
        train.runDays,

      distanceKm:
        train.distanceKm,

      durationMinutes:
        train.durationMinutes,

      avgSpeedKmh:
        train.avgSpeedKmh,

      maxSpeedKmh:
        train.maxSpeedKmh,

      totalHalts:
        train.totalHalts,

      returnTrain:
        train.returnTrain,

      currentLocation:
        train.currentLocation,

      nextHalt:
        train.nextHalt,

      meta:
        train.meta,
    };

    console.log(
      `✅ Live summary prepared: ${trainNumber}`
    );

    return res.status(200).json({
      success: true,
      data: liveData,
    });
  } catch (error) {
    console.error(
      "Live train status error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch live train status.",
    });
  }
};


// ============================================
// COMPLETE TRAIN ROUTE
// ============================================

const getTrainRoute = async (req, res) => {
  try {
    const { trainNumber } = req.params;

    if (
      !trainNumber ||
      !/^\d+$/.test(trainNumber)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid train number.",
      });
    }

    console.log(
      `🗺️ Train route requested: ${trainNumber}`
    );

    /*
     * Get the same normalized train data.
     *
     * NOTE:
     * This currently makes a RailRadar request.
     * Later we will add caching so /live and /route
     * don't unnecessarily consume API quota.
     */
    const train =
      await railwayApiService.getLiveTrainStatus(
        trainNumber
      );

    return res.status(200).json({
      success: true,

      data: {
        trainNumber:
          train.trainNumber,

        trainName:
          train.trainName,

        source:
          train.source,

        destination:
          train.destination,

        totalStations:
          train.route.length,

        route:
          train.route,
      },
    });
  } catch (error) {
    console.error(
      "Train route error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch train route.",
    });
  }
};


module.exports = {
  searchTrains,
  getLiveTrainStatus,
  getTrainRoute,
};