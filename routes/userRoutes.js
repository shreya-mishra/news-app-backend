import express from "express";
import uploadOptions from "../config/imageUpload.js";
import {
  addBookmarkNews,
  authUser,
  getBookmarkNews,
  getProfile,
  removeBookmarkNews,
  updateProfile,
  verifyOTP,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.route("/").get(getProfile);
router.route("/login").post(authUser);
router.route("/verify").post(verifyOTP);
router.route("/profile").put(protect, updateProfile);
router.route("/bookmark").get(protect, getBookmarkNews);
router.route("/bookmark").put(protect, addBookmarkNews);
router.route("/removebookmark").put(protect, removeBookmarkNews);
// .put(protect, uploadOptions.single("pic"), updateProfile);

export default router;
