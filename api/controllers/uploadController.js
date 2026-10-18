import fs from "fs";
import path from "path";
import { watermarkBuffer, uploadDir } from "../middleware/upload.js";

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = [];

    for (const file of req.files) {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${unique}.jpg`;
      const filepath = path.join(uploadDir, filename);

      const watermarked = await watermarkBuffer(file.buffer);
      fs.writeFileSync(filepath, watermarked);

      urls.push(`/uploads/${filename}`);
    }

    res.status(200).json({ urls });
  } catch (error) {
    next(error);
  }
};
