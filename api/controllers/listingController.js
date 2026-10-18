import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

// ADMIN: create
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// ADMIN: update
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));

  try {
    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// ADMIN: delete permanently
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing permanently deleted" });
  } catch (error) {
    next(error);
  }
};

// ADMIN: quick status toggle
export const setStatus = async (req, res, next) => {
  const { status } = req.body;
  const allowed = ["available", "sold", "rented", "unavailable"];
  if (!allowed.includes(status))
    return next(errorHandler(400, "Invalid status"));

  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return next(errorHandler(404, "Listing not found"));
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// PUBLIC: increment view counter (called on every listing open)
export const incrementView = async (req, res, next) => {
  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!updated) return next(errorHandler(404, "Listing not found"));
    res.status(200).json({ views: updated.views });
  } catch (error) {
    next(error);
  }
};

// ADMIN: manually adjust view count
export const adjustViews = async (req, res, next) => {
  const { views, mode } = req.body; // mode: "set" | "add"
  const n = Number(views);
  if (isNaN(n) || n < 0)
    return next(errorHandler(400, "Invalid views value"));

  try {
    let updated;
    if (mode === "add") {
      updated = await Listing.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: n } },
        { new: true }
      );
    } else {
      updated = await Listing.findByIdAndUpdate(
        req.params.id,
        { views: n },
        { new: true }
      );
    }
    if (!updated) return next(errorHandler(404, "Listing not found"));
    res.status(200).json({ views: updated.views });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: get one
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// PUBLIC: list with filters
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const filter = {};

    if (req.query.type && ["rent", "sale"].includes(req.query.type)) {
      filter.type = req.query.type;
    }

    if (
      req.query.status &&
      ["available", "sold", "rented", "unavailable"].includes(req.query.status)
    ) {
      filter.status = req.query.status;
    }

    const searchTerm = req.query.searchTerm || "";
    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { location: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const sort = req.query.sort || "listedAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const listings = await Listing.find(filter)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
