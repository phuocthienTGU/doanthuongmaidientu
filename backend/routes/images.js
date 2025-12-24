import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// List images in backend/images
router.get("/", async (req, res) => {
  try {
    const imagesDir = path.join(__dirname, "..", "images");
    const files = await fs.readdir(imagesDir);
    // filter common image extensions
    const imgs = files.filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
    res.json(imgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không thể đọc thư mục ảnh" });
  }
});

export default router;
