import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import productRoute from "./routes/product.route.js";
import authRoute from "./routes/auth.route.js";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/error.js";

//Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to uncaughtexception");
  process.exit(1);
});

dotenv.config({ path: "api/config/config.env" });

//connect to db
connectDatabase();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", productRoute);
app.use("/api/v1", authRoute);

//using middleware

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

//handle unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
