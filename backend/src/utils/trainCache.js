const cache = new Map();

const DEFAULT_TTL = 60 * 1000; // 60 seconds


const getCachedTrain = (trainNumber) => {
  const cached = cache.get(trainNumber);

  if (!cached) {
    return null;
  }

  const isExpired =
    Date.now() - cached.timestamp >
    cached.ttl;

  if (isExpired) {
    cache.delete(trainNumber);
    return null;
  }

  return cached.data;
};


const setCachedTrain = (
  trainNumber,
  data,
  ttl = DEFAULT_TTL
) => {
  cache.set(trainNumber, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};


const deleteCachedTrain = (trainNumber) => {
  cache.delete(trainNumber);
};


const clearCache = () => {
  cache.clear();
};


const getCacheStats = () => {
  return {
    size: cache.size,
    trains: Array.from(cache.keys()),
  };
};


module.exports = {
  getCachedTrain,
  setCachedTrain,
  deleteCachedTrain,
  clearCache,
  getCacheStats,
};