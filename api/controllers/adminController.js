import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const adminLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return next(errorHandler(401, "Invalid credentials"));

    const valid = await admin.comparePassword(password);
    if (!valid) return next(errorHandler(401, "Invalid credentials"));

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...rest } = admin._doc;

    res
      .cookie("admin_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie("admin_token").status(200).json("Logged out");
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ id: req.admin.id, role: "admin" });
};
