import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Gửi đánh giá
router.post("/", async (req, res) => {
  try {
    const { MaDonHang, MaUser, SoSao, NoiDung } = req.body;

    if (!MaDonHang || !MaUser || !SoSao || SoSao < 1 || SoSao > 5) {
      return res.status(400).json({ message: "Thiếu hoặc sai thông tin" });
    }

    // Kiểm tra đơn hàng có tồn tại và đã hoàn thành
    const [order] = await pool.query(
      "SELECT * FROM DonHang WHERE MaDonHang = ? AND TrangThai = 'hoan_thanh' AND MaUser = ?",
      [MaDonHang, MaUser]
    );

    if (order.length === 0) {
      return res
        .status(400)
        .json({ message: "Đơn hàng không hợp lệ hoặc chưa hoàn thành" });
    }

    // Kiểm tra đã đánh giá chưa
    const [exists] = await pool.query(
      "SELECT * FROM DanhGia WHERE MaDonHang = ? AND MaUser = ?",
      [MaDonHang, MaUser]
    );

    if (exists.length > 0) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá đơn hàng này rồi" });
    }

    await pool.query(
      "INSERT INTO DanhGia (MaDonHang, MaUser, SoSao, NoiDung) VALUES (?, ?, ?, ?)",
      [MaDonHang, MaUser, SoSao, NoiDung || null]
    );

    res.json({ message: "Đánh giá thành công! Cảm ơn bạn" });
  } catch (err) {
    console.error("Lỗi gửi đánh giá:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
router.get("/check/:maDonHang/:maUser", async (req, res) => {
  const { maDonHang, maUser } = req.params;
  const [rows] = await pool.query(
    "SELECT * FROM DanhGia WHERE MaDonHang = ? AND MaUser = ?",
    [maDonHang, maUser]
  );
  res.json({ alreadyRated: rows.length > 0 });
});
export default router;
