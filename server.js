import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import newsRoutes from "./routes/newsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import magazineRoutes from "./routes/magazineRoutes.js";
import viralRoutes from "./routes/viralRoutes.js";

import { errorHandler, notFound } from "./middlewares/errorMiddlewares.js";
import path from "path";


let port = process.env.PORT || 7000

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

app.use("/api", newsRoutes);

app.use("/api/news", newsRoutes);
app.use("/api/magazine", magazineRoutes);
app.use("/api/viral", viralRoutes);
app.use("/api/user", userRoutes);

app.use("/", newsRoutes);


//error middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, console.log(`Server Running on http://localhost:${port}/api`));
