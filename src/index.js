const express = require("express");
const cors = require("cors");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
// app.use("/tasks", taskRoutes);
// app.use("/ai", aiRoutes);

//Health check / root endpoint
app.get("/", (req, res) => {
  res.send("AI daily planner API is running");
});

//start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {});

const authMiddleware = require("./middleware/authMiddleware");

app.use("/tasks", authMiddleware, taskRoutes);
app.use("/ai", authMiddleware, aiRoutes);
