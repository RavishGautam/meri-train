const normalizeTrainStatus = (data) => {
  const rawStatus = String(data?.status || "").toLowerCase();
  const currentStatus = String(
    data?.currentLocation?.status || ""
  ).toLowerCase();

  if (
    rawStatus === "not-started" ||
    rawStatus === "not started"
  ) {
    return "Not Started";
  }

  if (currentStatus === "at-station") {
    return "At Station";
  }

  if (currentStatus === "running") {
    return "Running";
  }

  if (rawStatus === "completed") {
    return "Completed";
  }

  if (rawStatus === "cancelled") {
    return "Cancelled";
  }

  return data?.status || "Unknown";
};


const normalizeStation = (station) => {
  if (!station) {
    return null;
  }

  const code =
    station.code ||
    station.stationCode ||
    null;

  const name =
    station.name ||
    station.stationName ||
    null;

  // If neither code nor name exists,
  // consider this station invalid.
  if (!code && !name) {
    return null;
  }

  const normalizedStation = {
    code,
    name,
  };

  if (station.lat != null) {
    normalizedStation.lat = station.lat;
  }

  if (station.lng != null) {
    normalizedStation.lng = station.lng;
  }

  return normalizedStation;
};


const normalizeCurrentLocation = (location) => {
  if (!location) {
    return null;
  }

  return {
    stationCode:
      location.stationCode ||
      location.code ||
      null,

    stationName:
      location.stationName ||
      location.name ||
      null,

    sequence:
      location.sequence ?? null,

    status:
      location.status ||
      null,

    isHalt:
      location.isHalt ?? false,

    distanceFromOriginKm:
      location.distanceFromOriginKm ??
      location.distanceKm ??
      null,

    distanceFromLastStationKm:
      location.distanceFromLastStationKm ??
      null,

    segmentProgress:
      location.segmentProgress ??
      null,

    speedKmh:
      location.speedKmh ??
      0,

    delayMinutes:
      location.delayMinutes ??
      0,
  };
};


const normalizeNextHalt = (nextHalt) => {
  if (!nextHalt) {
    return null;
  }

  return {
    stationCode:
      nextHalt.stationCode ||
      nextHalt.code ||
      null,

    stationName:
      nextHalt.stationName ||
      nextHalt.name ||
      null,

    sequence:
      nextHalt.sequence ??
      null,

    distanceKm:
      nextHalt.distanceKm ??
      nextHalt.distance ??
      null,
  };
};


const normalizeRoute = (route = []) => {
  if (!Array.isArray(route)) {
    return [];
  }

  return route.map((station) => ({
    sequence:
      station.sequence ??
      null,

    stationCode:
      station.stationCode ||
      station.code ||
      null,

    stationName:
      station.stationName ||
      station.name ||
      null,

    isHalt:
      station.isHalt ??
      false,

    status:
      station.status ||
      null,

    scheduledArrival:
      station.scheduledArrival ||
      null,

    scheduledDeparture:
      station.scheduledDeparture ||
      null,

    actualArrival:
      station.actualArrival ||
      null,

    actualDeparture:
      station.actualDeparture ||
      null,

    delayArrival:
      station.delayArrival ??
      0,

    delayDeparture:
      station.delayDeparture ??
      0,

    platform:
      station.platform ||
      null,

    distanceKm:
      station.distanceKm ??
      station.distance ??
      null,

    speedToNextStationKmph:
      station.speedToNextStationKmph ??
      null,
  }));
};


const normalizeTrainData = (response) => {
  const data = response?.data;

  if (!data) {
    throw new Error("Invalid RailRadar response.");
  }

  /*
   * RailRadar may provide train information in:
   *
   * data.train
   *
   * OR directly inside:
   *
   * data
   */
  const train = data.train || {};

  /*
   * Route is important because the uploaded
   * 12951-live.json contains the actual
   * origin/destination information there.
   */
  const route = Array.isArray(data.route)
    ? data.route
    : [];

  const firstRouteStation =
    route.length > 0
      ? route[0]
      : null;

  const lastRouteStation =
    route.length > 0
      ? route[route.length - 1]
      : null;


  /*
   * Source
   *
   * Priority:
   * 1. data.source
   * 2. data.train.source
   * 3. first route station
   */
  const source =
    normalizeStation(data.source) ||
    normalizeStation(train.source) ||
    normalizeStation(firstRouteStation);


  /*
   * Destination
   *
   * Priority:
   * 1. data.destination
   * 2. data.train.destination
   * 3. last route station
   */
  const destination =
    normalizeStation(data.destination) ||
    normalizeStation(train.destination) ||
    normalizeStation(lastRouteStation);


  return {
    trainNumber:
      data.trainNumber ||
      train.number ||
      null,

    trainName:
      data.trainName ||
      train.name ||
      null,

    startDate:
      data.startDate ||
      null,

    lastUpdatedAt:
      data.lastUpdatedAt ||
      null,

    status:
      normalizeTrainStatus(data),

    rawStatus:
      data.rawStatus ||
      data.status ||
      null,

    isLive:
      data.isLive ??
      false,

    trackingMode:
      data.trackingMode ||
      null,

    delayMinutes:
      data.delayMinutes ??
      0,

    trainType:
      data.trainType ||
      train.type ||
      null,

    category:
      data.category ||
      train.category ||
      null,

    source,

    destination,

    runDays:
      data.runDays ||
      train.runDays ||
      [],

    distanceKm:
      data.distanceKm ??
      train.distance ??
      null,

    durationMinutes:
      data.durationMinutes ??
      train.duration ??
      null,

    avgSpeedKmh:
      data.avgSpeedKmh ??
      train.avgSpeed ??
      null,

    maxSpeedKmh:
      data.maxSpeedKmh ??
      train.maxSpeed ??
      null,

    totalHalts:
      data.totalHalts ??
      train.totalHalts ??
      null,

    returnTrain:
      data.returnTrain ||
      train.returnTrain ||
      null,

    coachPosition:
      data.coachPosition ||
      train.coachPosition ||
      null,

    currentLocation:
      normalizeCurrentLocation(
        data.currentLocation
      ),

    nextHalt:
      normalizeNextHalt(
        data.nextHalt
      ),

    route:
      normalizeRoute(route),

    meta: {
      timestamp:
        data.meta?.timestamp ||
        data.lastUpdatedAt ||
        null,

      source:
        data.meta?.source ||
        null,

      executionTimeMs:
        data.meta?.executionTimeMs ??
        data.meta?.executionTime ??
        null,
    },
  };
};


module.exports = {
  normalizeTrainData,
};