import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { newOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.route("/orders/new").post(isAuthenticatedUser, newOrder);

export default router;
