import uploadOptions from "../config/imageUpload.js";
import {
  createMagazine,
  getMagazine,
} from "../controllers/magazineControllers.js";
import express from "express";
const router = express.Router();
import { admin, protect } from "../middlewares/authMiddlewares.js";

router.route("/").get(getMagazine);
router
  .route("/admin/create")
  .post(protect, admin, uploadOptions.array("pics" /*, 10 */), createMagazine);

export default router;
