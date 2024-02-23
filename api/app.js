import express from "express";
import dotenv from "dotenv";
import productRoute from "./routes/product.route.js";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/error.js";

dotenv.config({ path: "api/config/config.env" });

//connect to db
connectDatabase();

const app = express();

app.use(express.json());
app.use("/api/v1", productRoute);

//using middleware

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(
    `server running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
