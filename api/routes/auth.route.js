import express from "express";
import {
  forgotPassword,
  loginUser,
  logout,
  registerUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").get(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);

export default router;
