import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/**
 * Lấy giỏ hàng đang dùng của user (trạng thái = 'dang_su_dung')
 * Kèm chi tiết sản phẩm + combo
 */

router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Gio hang API dang hoat dong",
    huongDan: "Dung /api/giohang/user/:maUser",
  });
});

router.get("/user/:maUser", async (req, res) => {
  try {
    const { maUser } = req.params;

    // Lấy giỏ hàng
    const [giohangRows] = await pool.query(
      "SELECT * FROM giohang WHERE MaUser = ? AND TrangThai = 'dang_su_dung' LIMIT 1",
      [maUser]
    );

    if (giohangRows.length === 0)
      return res
        .status(404)
        .json({ error: "Không tìm thấy giỏ hàng cho user" });

    const giohang = giohangRows[0];

    // Lấy chi tiết giỏ hàng
    const [chiTietRows] = await pool.query(
      `SELECT ghct.MaChiTiet, ghct.LoaiSanPham, ghct.MaSanPham, sp.TenSanPham, sp.Gia, sp.HinhAnh, 
              ghct.MaCombo, cb.TenCombo, cb.GiaCombo,
              ghct.SoLuong
       FROM giohangchitiet ghct
       LEFT JOIN sanpham sp ON ghct.MaSanPham = sp.MaSanPham
       LEFT JOIN combo cb ON ghct.MaCombo = cb.MaCombo
       WHERE ghct.MaGioHang = ?`,
      [giohang.MaGioHang]
    );

    res.json({ giohang, chiTiet: chiTietRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy giỏ hàng" });
  }
});

/**
 * Tạo giỏ hàng mới cho user (nếu chưa có giỏ hàng dang_su_dung)
 */
router.post("/user/:maUser", async (req, res) => {
  try {
    const { maUser } = req.params;

    // Kiểm tra đã có giỏ hàng dang_su_dung chưa
    const [checkRows] = await pool.query(
      "SELECT * FROM giohang WHERE MaUser = ? AND TrangThai = 'dang_su_dung'",
      [maUser]
    );

    if (checkRows.length > 0)
      return res
        .status(400)
        .json({ error: "User đã có giỏ hàng đang sử dụng" });

    // Tạo giỏ hàng mới
    await pool.query(
      "INSERT INTO giohang (MaUser, TrangThai) VALUES (?, 'dang_su_dung')",
      [maUser]
    );

    // Lấy giỏ hàng mới tạo (dựa trên MaUser và trạng thái)
    const [newCartRows] = await pool.query(
      "SELECT * FROM giohang WHERE MaUser = ? AND TrangThai = 'dang_su_dung' ORDER BY NgayTao DESC LIMIT 1",
      [maUser]
    );

    res.status(201).json({ giohang: newCartRows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tạo giỏ hàng" });
  }
});

/**
 * Thêm hoặc cập nhật sản phẩm/combo vào giỏ hàng
 * Body: { MaGioHang, LoaiSanPham: 'sanpham'|'combo', MaSanPham?, MaCombo?, SoLuong }
 */
router.post("/add", async (req, res) => {
  try {
    const { MaGioHang, LoaiSanPham, MaSanPham, MaCombo, SoLuong } = req.body;

    if (!MaGioHang || !LoaiSanPham || (!MaSanPham && !MaCombo) || !SoLuong) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    // Kiểm tra đã có dòng đó trong giỏ hàng chưa
    const [existingRows] = await pool.query(
      `SELECT * FROM giohangchitiet 
       WHERE MaGioHang = ? AND LoaiSanPham = ? AND 
       ( (LoaiSanPham = 'sanpham' AND MaSanPham = ?) OR (LoaiSanPham = 'combo' AND MaCombo = ?) )`,
      [MaGioHang, LoaiSanPham, MaSanPham || null, MaCombo || null]
    );

    if (existingRows.length > 0) {
      // Cập nhật số lượng cộng thêm
      const newSoLuong = existingRows[0].SoLuong + SoLuong;
      await pool.query(
        "UPDATE giohangchitiet SET SoLuong = ? WHERE MaChiTiet = ?",
        [newSoLuong, existingRows[0].MaChiTiet]
      );
      return res.json({ message: "Cập nhật số lượng sản phẩm trong giỏ hàng" });
    } else {
      // Thêm mới
      await pool.query(
        `INSERT INTO giohangchitiet 
        (MaGioHang, LoaiSanPham, MaSanPham, MaCombo, SoLuong) 
        VALUES (?, ?, ?, ?, ?)`,
        [MaGioHang, LoaiSanPham, MaSanPham || null, MaCombo || null, SoLuong]
      );
      return res.json({ message: "Thêm sản phẩm vào giỏ hàng thành công" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi thêm/cập nhật giỏ hàng" });
  }
});

// ADMIN - lấy tất cả giỏ hàng
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        MaGioHang,
        MaUser,
        NgayTao,
        TrangThai
      FROM giohang
      ORDER BY NgayTao DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy danh sách giỏ hàng" });
  }
});
// ADMIN - lấy chi tiết 1 giỏ hàng
router.get("/:maGioHang/chitiet", async (req, res) => {
  try {
    const { maGioHang } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        MaChiTiet,
        LoaiSanPham,
        MaSanPham,
        MaCombo,
        SoLuong
      FROM giohangchitiet
      WHERE MaGioHang = ?
    `,
      [maGioHang]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy chi tiết giỏ hàng" });
  }
});

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * Body: { SoLuong }
 */
router.put("/item/:maChiTiet", async (req, res) => {
  try {
    const { maChiTiet } = req.params;
    const { SoLuong } = req.body;

    if (SoLuong <= 0) {
      return res.status(400).json({ error: "Số lượng phải lớn hơn 0" });
    }

    await pool.query(
      "UPDATE giohangchitiet SET SoLuong = ? WHERE MaChiTiet = ?",
      [SoLuong, maChiTiet]
    );

    res.json({ message: "Cập nhật số lượng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi cập nhật số lượng" });
  }
});

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
router.delete("/item/:maChiTiet", async (req, res) => {
  try {
    const { maChiTiet } = req.params;

    await pool.query("DELETE FROM giohangchitiet WHERE MaChiTiet = ?", [
      maChiTiet,
    ]);

    res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi xóa sản phẩm khỏi giỏ hàng" });
  }
});

/**
 * Xóa hoặc hủy giỏ hàng (đổi trạng thái)
 */
router.delete("/:maGioHang", async (req, res) => {
  try {
    const { maGioHang } = req.params;

    await pool.query(
      "UPDATE giohang SET TrangThai = 'da_dat_hang' WHERE MaGioHang = ?",
      [maGioHang]
    );

    res.json({ message: "Hủy hoặc đặt giỏ hàng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi cập nhật trạng thái giỏ hàng" });
  }
});

export default router;
