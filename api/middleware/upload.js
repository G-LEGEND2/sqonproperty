import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const uploadDir = path.resolve("api/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Keep files in memory so we can watermark BEFORE saving
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files allowed"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

/**
 * Watermarks a buffer with "SQON" text and returns the new buffer.
 * Big white text, bottom-right, low opacity.
 */
export async function watermarkBuffer(buffer) {
  const image = sharp(buffer);
  const meta = await image.metadata();

  const width = meta.width || 1200;
  const height = meta.height || 800;

  // Scale font size to image size
  const fontSize = Math.max(36, Math.round(width * 0.07));

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .wm {
          fill: rgba(255,255,255,0.55);
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 900;
          font-size: ${fontSize}px;
          letter-spacing: 4px;
        }
      </style>
      <text
        x="${width - 30}"
        y="${height - 30}"
        text-anchor="end"
        class="wm"
        stroke="rgba(0,0,0,0.15)"
        stroke-width="2"
      >SQON</text>
    </svg>
  `;

  return image
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toBuffer();
}

export { uploadDir };
