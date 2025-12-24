import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* ===============================
   1. LẤY CHI TIẾT ĐƠN HÀNG THEO MÃ
================================= */
router.get("/donhang/:maDonHang", async (req, res) => {
  try {
    const { maDonHang } = req.params;

    const [rows] = await pool.query(
      `SELECT dhct.*, sp.TenSanPham, cb.TenCombo
       FROM DonHangChiTiet dhct
       LEFT JOIN SanPham sp ON dhct.MaSanPham = sp.MaSanPham
       LEFT JOIN Combo cb ON dhct.MaCombo = cb.MaCombo
       WHERE dhct.MaDonHang = ?`,
      [maDonHang]
    );

    res.json(rows);
  } catch (err) {
    console.error("Lỗi GET chi tiết:", err);
    res.status(500).json({ error: "Lỗi lấy chi tiết đơn hàng" });
  }
});

/* ===============================
   2. THÊM CHI TIẾT ĐƠN HÀNG
================================= */
router.post("/", async (req, res) => {
  console.log(">>> ĐÃ NHẬN YÊU CẦU THÊM CHI TIẾT!");
  console.log("📌 BODY nhận từ frontend:", req.body);
  try {
    const {
      MaDonHang,
      LoaiSanPham,
      MaSanPham,
      MaCombo,
      SoLuong,
      DonGia,
      ThanhTien,
    } = req.body;

    if (!MaDonHang || !LoaiSanPham || !SoLuong) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc!" });
    }

    const values = [
      MaDonHang,
      LoaiSanPham,

      // Nếu null, undefined, "", "  " => NULL
      MaSanPham && MaSanPham.trim() !== "" ? MaSanPham : null,

      // Nếu null, undefined, "", "  " => NULL
      MaCombo && MaCombo.trim() !== "" ? MaCombo : null,

      SoLuong,
      DonGia || 0,
      ThanhTien || 0,
    ];

    const sql = `
      INSERT INTO DonHangChiTiet 
      (MaDonHang, LoaiSanPham, MaSanPham, MaCombo, SoLuong, DonGia, ThanhTien)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, values);

    res.json({
      message: "Thêm chi tiết đơn hàng thành công",
      insertedId: result.insertId,
    });
  } catch (err) {
    console.error("Lỗi POST chi tiết:", err);
    res.status(500).json({ error: "Lỗi thêm chi tiết đơn hàng" });
  }
});

/* ===============================
   3. XÓA CHI TIẾT THEO ID (nếu cần)
================================= */
router.delete("/:maChiTiet", async (req, res) => {
  try {
    const { maChiTiet } = req.params;

    await pool.query("DELETE FROM DonHangChiTiet WHERE MaChiTiet = ?", [
      maChiTiet,
    ]);

    res.json({ message: "Xóa chi tiết thành công" });
  } catch (err) {
    console.error("Lỗi DELETE chi tiết:", err);
    res.status(500).json({ error: "Lỗi xóa chi tiết đơn hàng" });
  }
});

export default router;
