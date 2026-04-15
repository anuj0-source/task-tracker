const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const taskRoutes = require("./routes/task.routes");
const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    message: "Server is healthy.",
  });
});

app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
