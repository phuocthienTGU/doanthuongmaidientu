import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Lấy tất cả danh mục
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM DanhMuc");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy danh mục" });
  }
});

// Lấy danh mục theo mã
router.get("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM DanhMuc WHERE MaDanhMuc = ?",
      [ma]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy danh mục theo mã" });
  }
});

// Thêm danh mục
router.post("/", async (req, res) => {
  try {
    const { TenDanhMuc, MoTa } = req.body;
    if (!TenDanhMuc)
      return res.status(400).json({ error: "Thiếu tên danh mục" });
    const [result] = await pool.query(
      "INSERT INTO DanhMuc (TenDanhMuc, MoTa) VALUES (?, ?)",
      [TenDanhMuc, MoTa]
    );
    res.json({ message: "Thêm danh mục thành công", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm danh mục" });
  }
});

// Sửa danh mục
router.put("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const { TenDanhMuc, MoTa } = req.body;
    await pool.query(
      "UPDATE DanhMuc SET TenDanhMuc=?, MoTa=? WHERE MaDanhMuc=?",
      [TenDanhMuc, MoTa, ma]
    );
    res.json({ message: "Cập nhật danh mục thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật danh mục" });
  }
});

// Xóa danh mục
router.delete("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    // Cách xóa ở đây là xóa thật, bạn có thể chuyển sang xóa mềm nếu muốn
    await pool.query("DELETE FROM DanhMuc WHERE MaDanhMuc=?", [ma]);
    res.json({ message: "Xóa danh mục thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi xóa danh mục" });
  }
});

export default router;
