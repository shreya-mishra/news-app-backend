import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import newsRoutes from "./routes/newsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import magazineRoutes from "./routes/magazineRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares.js";
import path from "path";

const app = express();

//accept json data
app.use(express.json());

// making image folder public
const __dirname = path.resolve();
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// connecting to db
dotenv.config();
connectDB();

// Main API Routes
app.use("/api/news", newsRoutes);
app.use("/api/magazine", magazineRoutes);
app.use("/api/user", userRoutes);

app.use("/api", (req, res) => {
  res.send("API Working");
});

//error middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(5000, console.log("Server Running on http://localhost:5000/api"));
