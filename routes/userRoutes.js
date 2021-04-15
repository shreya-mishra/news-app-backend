import express from "express";
import uploadOptions from "../config/imageUpload.js";
import {
  authUser,
  getProfile,
  updateProfile,
  verifyOTP,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.route("/").get(getProfile);
router.route("/login").post(authUser);
router.route("/verify").post(verifyOTP);
router
  .route("/profile")
  .put(protect, uploadOptions.single("pic"), updateProfile);

export default router;
