import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Lấy tất cả sản phẩm đang hiển thị
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM SanPham WHERE TrangThai = 'hienthi'"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy sản phẩm" });
  }
});

// Lấy sản phẩm theo mã
router.get("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM SanPham WHERE MaSanPham = ?",
      [ma]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy sản phẩm theo mã" });
  }
});

// Thêm sản phẩm mới
router.post("/", async (req, res) => {
  try {
    const { MaDanhMuc, TenSanPham, MoTa, Gia, HinhAnh } = req.body;

    if (!MaDanhMuc || !TenSanPham || !Gia) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    const sql = `
            INSERT INTO SanPham (MaDanhMuc, TenSanPham, MoTa, Gia, HinhAnh, TrangThai)
            VALUES (?, ?, ?, ?, ?, 'hienthi')
        `;
    const [result] = await pool.query(sql, [
      MaDanhMuc,
      TenSanPham,
      MoTa,
      Gia,
      HinhAnh,
    ]);
    res.json({ message: "Thêm sản phẩm thành công", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi thêm sản phẩm" });
  }
});

// Sửa sản phẩm
router.put("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const { TenSanPham, MoTa, Gia, HinhAnh, TrangThai } = req.body;

    const sql = `
            UPDATE SanPham SET TenSanPham=?, MoTa=?, Gia=?, HinhAnh=?, TrangThai=? WHERE MaSanPham=?
        `;
    await pool.query(sql, [TenSanPham, MoTa, Gia, HinhAnh, TrangThai, ma]);
    res.json({ message: "Cập nhật sản phẩm thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi cập nhật sản phẩm" });
  }
});

// Xóa mềm sản phẩm (chỉ ẩn)
router.delete("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    await pool.query("UPDATE SanPham SET TrangThai='an' WHERE MaSanPham=?", [
      ma,
    ]);
    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi xóa sản phẩm" });
  }
});

export default router;
