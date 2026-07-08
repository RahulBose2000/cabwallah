const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectToDb = require("./db/db");
const app = express();

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");

const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173", // This allows requests from localhost:5173
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow certain methods
    origin: true,
    credentials: true, // Allow sending cookies (if needed)
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToDb();

app.get("/", (req, res) => {
  res.send("listening");
});

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapRoutes);
app.use("/rides", rideRoutes);
// console.log("API KEY:", process.env.GOOGLE_MAPS_API_KEY);
module.exports = app;
