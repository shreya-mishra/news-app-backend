import uploadOptions from "../config/imageUpload.js";
import {
  createNews,
  getNews,
  deleteNews,
  deleteAnyNews,
  likeNews,
  unlikeNews,
  commentNews,
  delCommentNews,
  reportNews,
  getReportNews,
} from "../controllers/newsControllers.js";
import {
  createTempNews,
  approveNews,
  disapproveNews,
  getApproveNews,
} from "../controllers/tempNewsControllers.js";
import express from "express";
const router = express.Router();
import { admin, protect } from "../middlewares/authMiddlewares.js";

// ----> Main News
// Normal News
router.route("/").get(getNews);
router.route("/:id").delete(protect, deleteNews);
router.route("/like").put(protect, likeNews);
router.route("/unlike").put(protect, unlikeNews);
router.route("/comment").put(protect, commentNews);
router.route("/deletecomment").put(protect, delCommentNews);
router.route("/report").get(protect, getReportNews);
router.route("/report").put(protect, reportNews);
// Admin Routes
router.route("/admin/:id").delete(protect, admin, deleteAnyNews);
// router
//   .route("/admin/create")
//   .post(protect, admin, uploadOptions.single("pic"), createNews);
router.route("/admin/create").post(protect, admin, createNews);

// ----> Temporary News
// Normal News
router.route("/create").post(protect, createTempNews);
//Admin Routes
router.route("/admin/approve").get(getApproveNews);
// router.route("/admin/approve/:id").post(protect, admin, approveNews);
router.route("/admin/approve/:id").post(approveNews);
router.route("/admin/approve/:id").delete(protect, admin, disapproveNews);

export default router;
