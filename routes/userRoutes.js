import express from "express";
import { authUser, verifyOTP } from "../controllers/userControllers.js";

const router = express.Router();

router.route("/login").post(authUser);
router.route("/verify").post(verifyOTP);

export default router;
