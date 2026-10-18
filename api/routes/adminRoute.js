import express from "express";
import {
  adminLogin,
  adminLogout,
  checkAdmin,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.get("/me", verifyAdmin, checkAdmin);

export default router;
