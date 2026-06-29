const express = require("express");
const cors = require("cors");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

//middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:4200",
//       "https://ai-daily-planner-frontend-dhmb93rwg-solo-explorer.vercel.app",
//     ],
//   }),
// );
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (
        origin === "http://localhost:4200" ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

//routes
// app.use("/tasks", taskRoutes);
// app.use("/ai", aiRoutes);

//Health check / root endpoint
app.get("/", (req, res) => {
  res.send("AI daily planner API is running");
});

const authMiddleware = require("./middleware/authMiddleware");

app.use("/tasks", authMiddleware, taskRoutes);
app.use("/ai", authMiddleware, aiRoutes);

//start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
