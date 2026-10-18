import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadImages } from "../controllers/uploadController.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyAdmin, upload.array("images", 20), uploadImages);

export default router;
