import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* ======================================================
   API TẠO ĐƠN HÀNG FULL (DonHang + DonHangChiTiet + Combo)
====================================================== */
router.post("/create", async (req, res) => {
  console.log("📦 Received order:", req.body);

  const {
    MaUser,
    TongTien,
    Items,
    HinhThucThanhToan,
    MaGiamGia = null, // Thêm dòng này, mặc định null nếu không có
  } = req.body;

  if (!MaUser || !TongTien || !Items || Items.length === 0) {
    return res.status(400).json({ error: "Thiếu dữ liệu tạo đơn hàng" });
  }

  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    /* -------------------------
       1️⃣ Tạo đơn hàng
    --------------------------*/
    // 1. Insert đơn hàng (MaDonHang do trigger tự tạo)
    await conn.query(
      `INSERT INTO DonHang 
   (MaUser, TongTien, HinhThucThanhToan, TrangThai, NgayDat, MaGiamGia)
   VALUES (?, ?, ?, 'cho_duyet', NOW(), ?)`,
      [MaUser, TongTien, HinhThucThanhToan, MaGiamGia]
    );

    // 2. Lấy MaDonHang vừa được trigger tạo
    const [rows] = await conn.query(
      `SELECT MaDonHang
   FROM DonHang
   WHERE MaUser = ?
   ORDER BY NgayDat DESC
   LIMIT 1`,
      [MaUser]
    );

    if (!rows.length) throw new Error("Không lấy được MaDonHang sau insert");

    const newOrderId = rows[0].MaDonHang;

    /* -------------------------
       2️⃣ Thêm các dòng chi tiết
    --------------------------*/
    for (let item of Items) {
      const {
        LoaiSanPham,
        MaSanPham,
        MaCombo,
        SoLuong,
        DonGia,
        ThanhTien,
        ComboItems, // danh sách đổi món nếu có
      } = item;

      const [ctResult] = await conn.query(
        `INSERT INTO DonHangChiTiet 
        (MaDonHang, LoaiSanPham, MaSanPham, MaCombo, SoLuong, DonGia, ThanhTien)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newOrderId,
          LoaiSanPham,
          MaSanPham || null,
          MaCombo || null,
          SoLuong,
          DonGia,
          ThanhTien,
        ]
      );

      const maChiTiet = ctResult.insertId;

      /* -------------------------
         3️⃣ Nếu là combo → lưu đổi món
      --------------------------*/
      if (ComboItems && ComboItems.length > 0) {
        for (let c of ComboItems) {
          await conn.query(
            `INSERT INTO DonHangComboChiTiet 
            (MaChiTiet, MaSanPham, SoLuong)
            VALUES (?, ?, ?)`,
            [maChiTiet, c.MaSanPham, c.SoLuong]
          );
        }
      }
    }

    await conn.commit();

    res.json({
      message: "Tạo đơn hàng FULL thành công",
      MaDonHang: newOrderId,
    });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Lỗi tạo đơn hàng FULL:", err);
    res.status(500).json({ error: "Lỗi xử lý đơn hàng" });
  } finally {
    conn.release();
  }
});

export default router;
