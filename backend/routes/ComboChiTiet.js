import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Lấy chi tiết combo theo mã combo
router.get("/combo/:maCombo", async (req, res) => {
  try {
    const { maCombo } = req.params;
    const [rows] = await pool.query(
      `SELECT cct.MaComboChiTiet, cct.MaCombo, cct.MaSanPham, sp.TenSanPham, cct.SoLuong
       FROM ComboChiTiet cct
       JOIN SanPham sp ON cct.MaSanPham = sp.MaSanPham
       WHERE cct.MaCombo = ?`,
      [maCombo]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy chi tiết combo" });
  }
});

// Thêm chi tiết combo (thêm món vào combo)
router.post("/", async (req, res) => {
  try {
    const { MaCombo, MaSanPham, SoLuong } = req.body;
    if (!MaCombo || !MaSanPham || !SoLuong)
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });

    const sql = `
      INSERT INTO ComboChiTiet (MaCombo, MaSanPham, SoLuong)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(sql, [MaCombo, MaSanPham, SoLuong]);
    res.json({
      message: "Thêm chi tiết combo thành công",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm chi tiết combo" });
  }
});

// Cập nhật chi tiết combo
router.put("/:maChiTiet", async (req, res) => {
  try {
    const { maChiTiet } = req.params;
    const { MaCombo, MaSanPham, SoLuong } = req.body;
    if (!MaCombo || !MaSanPham || !SoLuong)
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });

    const sql = `
      UPDATE ComboChiTiet SET MaCombo=?, MaSanPham=?, SoLuong=? WHERE MaComboChiTiet=?
    `;
    await pool.query(sql, [MaCombo, MaSanPham, SoLuong, maChiTiet]);
    res.json({ message: "Cập nhật chi tiết combo thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật chi tiết combo" });
  }
});

// Xóa chi tiết combo
router.delete("/:maChiTiet", async (req, res) => {
  try {
    const { maChiTiet } = req.params;
    await pool.query("DELETE FROM ComboChiTiet WHERE MaComboChiTiet=?", [
      maChiTiet,
    ]);
    res.json({ message: "Xóa chi tiết combo thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi xóa chi tiết combo" });
  }
});

export default router;
