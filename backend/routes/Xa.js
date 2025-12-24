import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Lấy danh sách xã
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT MaXa, TenXa FROM xa_toado ORDER BY TenXa"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy tọa độ của một xã
router.get("/:maXa", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT Lat, Lng FROM xa_toado WHERE MaXa = ?",
      [req.params.maXa]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
