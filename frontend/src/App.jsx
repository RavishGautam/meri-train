import { useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveTrain, setLiveTrain] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // SEARCH TRAINS
  // ==========================================

  const searchTrains = async () => {
    const query = searchQuery.trim();

    if (!query) {
      setError(
        "Please enter a train number or train name."
      );
      setTrains([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setLiveTrain(null);
      setTrains([]);

      const response = await fetch(
        `${API_BASE_URL}/trains/search?q=${encodeURIComponent(
          query
        )}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to search trains."
        );
      }

      if (!result.data || result.data.length === 0) {
        setError(
          "No trains found. Please check your search."
        );
        return;
      }

      setTrains(result.data);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // GET LIVE TRAIN STATUS
  // ==========================================

  const getLiveTrainStatus = async (
    trainNumber
  ) => {
    try {
      setLiveLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/trains/${encodeURIComponent(
          trainNumber
        )}/live`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to fetch live train status."
        );
      }

      setLiveTrain(result.data);

      // Scroll to live section
      setTimeout(() => {
        document
          .getElementById("live-train-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 50);
    } catch (err) {
      setError(
        err.message ||
          "Unable to fetch live train status."
      );
    } finally {
      setLiveLoading(false);
    }
  };


  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = (event) => {
    event.preventDefault();
    searchTrains();
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatLastUpdated = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClasses = (status) => {
    switch (status) {
      case "Running":
        return "bg-green-50 text-green-700 ring-green-200";

      case "At Station":
        return "bg-blue-50 text-blue-700 ring-blue-200";

      case "Completed":
        return "bg-purple-50 text-purple-700 ring-purple-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 ring-red-200";

      case "Not Started":
        return "bg-amber-50 text-amber-700 ring-amber-200";

      default:
        return "bg-slate-50 text-slate-700 ring-slate-200";
    }
  };


  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================
          HEADER
      ======================================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">

          <button
            type="button"
            onClick={() => {
              setLiveTrain(null);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="cursor-pointer text-left"
          >
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              🚆 Meri Train
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Simple and reliable train information
            </p>
          </button>

        </div>
      </header>


      {/* ======================================
          MAIN
      ======================================= */}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">

        {/* SEARCH SECTION */}

        <section className="mx-auto max-w-2xl">

          <div className="mb-8 text-center">

            <div className="mb-5 text-6xl">
              🚆
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Where Is My Train?
            </h2>

            <p className="mx-auto mt-3 max-w-md text-base leading-6 text-slate-600">
              Enter a train number or train name to find train information.
            </p>

          </div>


          {/* SEARCH FORM */}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200 sm:p-6"
          >

            <label
              htmlFor="train-search"
              className="mb-2 block text-left text-sm font-semibold text-slate-700"
            >
              Train Number or Train Name
            </label>

            <input
              id="train-search"
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="e.g. 12951 or Rajdhani Express"
              className="w-full rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full cursor-pointer rounded-xl bg-slate-900 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Searching..."
                : "🔍 Search Train"}
            </button>

          </form>


          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
              {error}
            </div>
          )}


          {/* ==================================
              SEARCH RESULTS
          =================================== */}

          {trains.length > 0 && (
            <section className="mt-8">

              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Search Results
              </h3>

              <div className="space-y-4">

                {trains.map((train) => (
                  <div
                    key={train.trainNumber}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <p className="text-sm font-semibold text-slate-500">
                          Train {train.trainNumber}
                        </p>

                        <h4 className="mt-1 text-lg font-bold text-slate-900">
                          {train.trainName}
                        </h4>
                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Scheduled
                      </span>

                    </div>


                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          From
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {train.source}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          To
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {train.destination}
                        </p>
                      </div>


                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Duration
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {train.duration}
                        </p>
                      </div>

                    </div>


                    <div className="mt-5 border-t border-slate-100 pt-4">

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:gap-4">

                          <span>
                            Departure:{" "}
                            <strong className="text-slate-900">
                              {train.departure}
                            </strong>
                          </span>

                          <span>
                            Arrival:{" "}
                            <strong className="text-slate-900">
                              {train.arrival}
                            </strong>
                          </span>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            getLiveTrainStatus(
                              train.trainNumber
                            )
                          }
                          disabled={liveLoading}
                          className="cursor-pointer rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {liveLoading
                            ? "Loading..."
                            : "📍 View Live Status"}
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </section>
          )}

        </section>


        {/* ======================================
            LIVE TRAIN SECTION
        ======================================= */}

        {liveTrain && (
          <section
            id="live-train-section"
            className="mx-auto mt-10 max-w-4xl scroll-mt-6"
          >

            {/* LIVE HEADER */}

            <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">

              <div className="border-b border-slate-100 p-5 sm:p-7">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <p className="text-sm font-semibold text-slate-500">
                      Train {liveTrain.trainNumber}
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                      {liveTrain.trainName}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-2">

                      {liveTrain.trainType && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {liveTrain.trainType}
                        </span>
                      )}

                      {liveTrain.category && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {liveTrain.category}
                        </span>
                      )}

                    </div>

                  </div>


                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${getStatusClasses(
                      liveTrain.status
                    )}`}
                  >
                    {liveTrain.status}
                  </span>

                </div>


                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                  {liveTrain.isLive && (
                    <span className="flex items-center gap-1.5 font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Live tracking
                    </span>
                  )}

                  <span>
                    Updated{" "}
                    {formatLastUpdated(
                      liveTrain.lastUpdatedAt
                    )}
                  </span>

                </div>

              </div>


              {/* JOURNEY */}

              <div className="p-5 sm:p-7">

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      From
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {liveTrain.source?.name ||
                        "Unknown"}
                    </p>

                    <p className="text-sm font-semibold text-slate-500">
                      {liveTrain.source?.code ||
                        "--"}
                    </p>
                  </div>


                  <div className="text-center text-2xl">
                    →
                  </div>


                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      To
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {liveTrain.destination?.name ||
                        "Unknown"}
                    </p>

                    <p className="text-sm font-semibold text-slate-500">
                      {liveTrain.destination?.code ||
                        "--"}
                    </p>
                  </div>

                </div>


                {/* JOURNEY STATS */}

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Distance
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {liveTrain.distanceKm ?? "--"}
                      <span className="ml-1 text-xs font-medium text-slate-500">
                        km
                      </span>
                    </p>
                  </div>


                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Duration
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {liveTrain.durationMinutes
                        ? `${Math.floor(
                            liveTrain.durationMinutes /
                              60
                          )}h ${liveTrain.durationMinutes % 60}m`
                        : "--"}
                    </p>
                  </div>


                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Average Speed
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {liveTrain.avgSpeedKmh ?? "--"}
                      <span className="ml-1 text-xs font-medium text-slate-500">
                        km/h
                      </span>
                    </p>
                  </div>


                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Delay
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {liveTrain.delayMinutes ?? 0}
                      <span className="ml-1 text-xs font-medium text-slate-500">
                        min
                      </span>
                    </p>
                  </div>

                </div>

              </div>


              {/* CURRENT LOCATION */}

              {liveTrain.currentLocation && (
                <div className="border-t border-slate-100 p-5 sm:p-7">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Current Location
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {
                          liveTrain.currentLocation
                            .stationName
                        }
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {
                          liveTrain.currentLocation
                            .stationCode
                        }
                      </p>
                    </div>


                    <div className="rounded-2xl bg-slate-100 p-4 text-center">

                      <p className="text-xs font-medium text-slate-500">
                        Speed
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {
                          liveTrain.currentLocation
                            .speedKmh
                        }
                        <span className="ml-1 text-xs font-medium">
                          km/h
                        </span>
                      </p>

                    </div>

                  </div>


                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-2xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Distance from Origin
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {
                          liveTrain.currentLocation
                            .distanceFromOriginKm ??
                          "--"
                        }{" "}
                        km
                      </p>

                    </div>


                    <div className="rounded-2xl bg-slate-50 p-4">

                      <p className="text-xs font-medium text-slate-500">
                        Station Status
                      </p>

                      <p className="mt-1 font-bold text-slate-900">
                        {liveTrain.currentLocation
                          .status ===
                        "at-station"
                          ? "At Station"
                          : "Running"}
                      </p>

                    </div>

                  </div>

                </div>
              )}


              {/* NEXT HALT */}

              {liveTrain.nextHalt && (
                <div className="border-t border-slate-100 bg-slate-50 p-5 sm:p-7">

                  <p className="text-sm font-semibold text-slate-500">
                    Next Halt
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold text-slate-900">
                        {
                          liveTrain.nextHalt
                            .stationName
                        }
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {
                          liveTrain.nextHalt
                            .stationCode
                        }
                      </p>

                    </div>


                    <div className="text-right">

                      <p className="text-xl font-bold text-slate-900">
                        {
                          liveTrain.nextHalt
                            .distanceKm
                        }{" "}
                        km
                      </p>

                      <p className="text-xs text-slate-500">
                        remaining
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;