import express from "express";
import {
  forgotPassword,
  loginUser,
  logout,
  registerUser,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").get(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

export default router;
