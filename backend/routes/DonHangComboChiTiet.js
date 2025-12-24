import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Lấy chi tiết đổi món combo theo mã chi tiết đơn hàng
router.get("/chitiet/:maChiTiet", async (req, res) => {
  try {
    const { maChiTiet } = req.params;
    const [rows] = await pool.query(
      `SELECT ctcc.*, sp.TenSanPham FROM DonHangComboChiTiet ctcc
       JOIN SanPham sp ON ctcc.MaSanPham = sp.MaSanPham
       WHERE ctcc.MaChiTiet = ?`,
      [maChiTiet]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy chi tiết đổi món combo" });
  }
});

// Thêm chi tiết đổi món combo
router.post("/", async (req, res) => {
  try {
    const { MaChiTiet, MaSanPham, SoLuong } = req.body;
    if (!MaChiTiet || !MaSanPham || !SoLuong)
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });

    const sql = `
      INSERT INTO DonHangComboChiTiet (MaChiTiet, MaSanPham, SoLuong)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.query(sql, [MaChiTiet, MaSanPham, SoLuong]);
    res.json({
      message: "Thêm chi tiết đổi món combo thành công",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm chi tiết đổi món combo" });
  }
});

// Cập nhật chi tiết đổi món combo
router.put("/:maCTCombo", async (req, res) => {
  try {
    const { maCTCombo } = req.params;
    const { MaChiTiet, MaSanPham, SoLuong } = req.body;
    if (!MaChiTiet || !MaSanPham || !SoLuong)
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });

    const sql = `
      UPDATE DonHangComboChiTiet SET MaChiTiet=?, MaSanPham=?, SoLuong=? WHERE MaCTCombo=?
    `;
    await pool.query(sql, [MaChiTiet, MaSanPham, SoLuong, maCTCombo]);
    res.json({ message: "Cập nhật chi tiết đổi món combo thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật chi tiết đổi món combo" });
  }
});

// Xóa chi tiết đổi món combo
