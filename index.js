require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/user.routes");
const taskRoutes = require("./src/routes/task.routes");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/tasks", taskRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to my Auth Class!");
});

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
