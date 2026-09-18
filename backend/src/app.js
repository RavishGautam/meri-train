const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const trainRoutes = require("./routes/trainRoutes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(morgan("dev"));

/*
 * Health check
 */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Meri Train API is running",
    timestamp: new Date().toISOString(),
  });
});

/*
 * Train Routes
 */
app.use("/api/trains", trainRoutes);

module.exports = app;