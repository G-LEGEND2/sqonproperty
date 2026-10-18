import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["rent", "sale"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented", "unavailable"],
      default: "available",
    },
    images: {
      type: [String],
      required: true,
      validate: [(v) => v.length > 0, "At least one image is required"],
    },
    listedAt: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
