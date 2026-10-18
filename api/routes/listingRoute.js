import express from "express";
import {
  createListing,
  deleteListing,
  getListings,
  getListing,
  updateListing,
  setStatus,
  incrementView,
  adjustViews,
} from "../controllers/listingController.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";

const router = express.Router();

// PUBLIC
router.get("/get", getListings);
router.get("/get/:id", getListing);
router.post("/increment-view/:id", incrementView);

// ADMIN ONLY
router.post("/create", verifyAdmin, createListing);
router.post("/update/:id", verifyAdmin, updateListing);
router.post("/status/:id", verifyAdmin, setStatus);
router.post("/views/:id", verifyAdmin, adjustViews);
router.delete("/delete/:id", verifyAdmin, deleteListing);

export default router;
