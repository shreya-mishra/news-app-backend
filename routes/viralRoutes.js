import {
  createViral,
  deleteAnyViral,
  deleteViral,
  getViral,
  likeViral,
  unlikeViral,
  commentViral,
  delCommentViral,
} from "../controllers/viralControllers.js";
import express from "express";
const router = express.Router();
import { admin, protect } from "../middlewares/authMiddlewares.js";

router.route("/").get(getViral);
router.route("/create").post(protect, admin, createViral);
router.route("/:id").delete(protect, deleteViral);
router.route("/like").put(protect, likeViral);
router.route("/unlike").put(protect, unlikeViral);
router.route("/comment").put(protect, commentViral);
router.route("/deletecomment").put(protect, delCommentViral);

// Admin Routes
router.route("/admin/:id").delete(protect, admin, deleteAnyViral);

export default router;
