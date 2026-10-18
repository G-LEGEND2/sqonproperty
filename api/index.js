import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import adminRouter from "./routes/adminRoute.js";
import listingRouter from "./routes/listingRoute.js";
import uploadRouter from "./routes/uploadRoute.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "api/uploads")));

app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/api/admin", adminRouter);
app.use("/api/listing", listingRouter);
app.use("/api/upload", uploadRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(3000, () => console.log("Server running on port 3000"));
