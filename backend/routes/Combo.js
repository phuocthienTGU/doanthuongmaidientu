import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Lấy tất cả combo đang hiển thị
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Combo WHERE TrangThai = 'hienthi'"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy combo" });
  }
});

// Lấy combo theo mã
router.get("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const [rows] = await pool.query("SELECT * FROM Combo WHERE MaCombo = ?", [
      ma,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Không tìm thấy combo" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy combo theo mã" });
  }
});

// Thêm combo mới
router.post("/", async (req, res) => {
  try {
    const { TenCombo, GiaCombo, MoTa, HinhAnh } = req.body;
    if (!TenCombo || !GiaCombo)
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });

    const sql = `
      INSERT INTO Combo (TenCombo, GiaCombo, MoTa, HinhAnh, TrangThai)
      VALUES (?, ?, ?, ?, 'hienthi')
    `;
    const [result] = await pool.query(sql, [TenCombo, GiaCombo, MoTa, HinhAnh]);
    res.json({ message: "Thêm combo thành công", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm combo" });
  }
});

// Sửa combo
router.put("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const { TenCombo, GiaCombo, MoTa, HinhAnh, TrangThai } = req.body;

    const sql = `
      UPDATE Combo SET TenCombo=?, GiaCombo=?, MoTa=?, HinhAnh=?, TrangThai=? WHERE MaCombo=?
    `;
    await pool.query(sql, [TenCombo, GiaCombo, MoTa, HinhAnh, TrangThai, ma]);
    res.json({ message: "Cập nhật combo thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật combo" });
  }
});

// Xóa combo (ẩn)
router.delete("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    await pool.query("UPDATE Combo SET TrangThai='an' WHERE MaCombo=?", [ma]);
    res.json({ message: "Xóa combo thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi xóa combo" });
  }
});

export default router;
