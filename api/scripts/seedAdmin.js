import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/adminModel.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO);

  const username = "admin";
  const password = "ChangeMe123!";

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log("Admin already exists");
  } else {
    await Admin.create({ username, password });
    console.log("Admin created:", username);
  }
  process.exit(0);
};

run();
