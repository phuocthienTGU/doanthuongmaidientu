import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* ============================
   1. LẤY TẤT CẢ ĐƠN HÀNG
============================ */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT dh.*, u.HoTen 
       FROM DonHang dh
       LEFT JOIN User u ON dh.MaUser = u.MaUser
       ORDER BY dh.NgayDat DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy đơn hàng" });
  }
});

/* ============================
   2. LẤY ĐƠN HÀNG THEO MÃ
============================ */
router.get("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;

    const [rows] = await pool.query(
      `SELECT dh.*, u.HoTen 
       FROM DonHang dh
       LEFT JOIN User u ON dh.MaUser = u.MaUser
       WHERE dh.MaDonHang = ?`,
      [ma]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy đơn hàng theo mã" });
  }
});

/* ============================
   3. THÊM ĐƠN HÀNG
============================ */
router.post("/", async (req, res) => {
  try {
    const { MaUser, TongTien, TrangThai } = req.body;

    if (!MaUser || !TongTien) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    const [result] = await pool.query(
      `INSERT INTO DonHang (MaUser, TongTien, TrangThai, NgayDat)
       VALUES (?, ?, ?, NOW())`,
      [MaUser, TongTien, TrangThai || "cho_duyet"]
    );

    res.json({
      message: "Thêm đơn hàng thành công",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi thêm đơn hàng" });
  }
});

/* ============================
   4. CẬP NHẬT ĐƠN HÀNG
============================ 
router.put("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const { MaUser, TongTien, TrangThai } = req.body;

    await pool.query(
      `UPDATE DonHang 
       SET MaUser=?, TongTien=?, TrangThai=? 
       WHERE MaDonHang=?`,
      [MaUser, TongTien, TrangThai, ma]
    );

    res.json({ message: "Cập nhật đơn hàng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi cập nhật đơn hàng" });
  }
});*/

/*// Trong file routes/DonHang.js (hoặc file chứa route PUT /:ma)
router.put("/:ma", async (req, res) => {
  const { ma } = req.params;
  const { TrangThai, LyDoHuy, MaNhanVien } = req.body; // Chỉ lấy các trường cần update

  let sql = "UPDATE DonHang SET ";
  const values = [];
  const updates = [];

  if (TrangThai) {
    updates.push("TrangThai = ?");
    values.push(TrangThai);
  }

  if (LyDoHuy) {
    updates.push("LyDoHuy = ?");
    values.push(LyDoHuy);
  }

  // Nếu có thêm trường nào cần update, thêm tương tự
  // if (MaNhanVien) { updates.push("MaNhanVien = ?"); values.push(MaNhanVien); }

  if (updates.length === 0) {
    return res.status(400).json({ message: "Không có trường nào để cập nhật" });
  }

  sql += updates.join(", ") + " WHERE MaDonHang = ?";
  values.push(ma);

  try {
    await pool.query(sql, values);
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật" });
  }
});*/
// GET /api/donhang với query params
router.get("/", async (req, res) => {
  const { TrangThai, MaNhanVien, Ngay } = req.query;
  let sql = `
    SELECT 
  dh.*,
  kh.HoTen AS HoTenKhachHang,
  nv.HoTen AS HoTenNhanVien,
  nv.DienThoai AS DienThoaiNhanVien
FROM DonHang dh
LEFT JOIN user kh ON dh.MaUser = kh.MaUser
LEFT JOIN user nv ON dh.MaNhanVien = nv.MaUser
ORDER BY dh.NgayDat DESC
  `;
  const values = [];

  if (TrangThai) {
    sql += " AND dh.TrangThai = ?";
    values.push(TrangThai);
  }
  if (MaNhanVien) {
    sql += " AND dh.MaNhanVien = ?";
    values.push(MaNhanVien);
  }
  if (Ngay) {
    sql += " AND DATE(dh.NgayDat) = ?";
    values.push(Ngay);
  }

  const [rows] = await pool.query(sql, values);
  res.json(rows);
});

// PUT /api/donhang/:ma/nhan - Nhận đơn
/*router.put("/:ma/nhan", async (req, res) => {
  const { ma } = req.params;
  const { MaNhanVien } = req.body;

  const [check] = await pool.query(
    "SELECT * FROM DonHang WHERE MaDonHang = ? AND TrangThai = 'cho_duyet' AND MaNhanVien IS NULL",
    [ma]
  );

  if (check.length === 0) {
    return res.status(400).json({
      message: "Đơn hàng đã được nhận bởi người khác hoặc không tồn tại!",
    });
  }

  await pool.query(
    "UPDATE DonHang SET TrangThai = 'da_nhan', MaNhanVien = ? WHERE MaDonHang = ?",
    [MaNhanVien, ma]
  );

  res.json({ message: "Đã nhận đơn thành công" });
});*/

/*// PUT /api/donhang/:ma - Cập nhật trạng thái
router.put("/:ma", async (req, res) => {
  const { ma } = req.params;
  const { TrangThai, LyDoHuy } = req.body;

  let sql = "UPDATE DonHang SET TrangThai = ?";
  const values = [TrangThai];

  if (TrangThai === "huy" && LyDoHuy) {
    sql += ", LyDoHuy = ?";
    values.push(LyDoHuy);
  }

  sql += " WHERE MaDonHang = ?";
  values.push(ma);

  await pool.query(sql, values);

  res.json({ message: "Cập nhật trạng thái thành công" });
});*/

router.put("/:ma", async (req, res) => {
  const { ma } = req.params;
  const { TrangThai, LyDoHuy, MaNhanVien } = req.body; // Chỉ lấy trường cần

  let sql = "UPDATE DonHang SET ";
  const values = [];
  const updates = [];

  if (TrangThai !== undefined) {
    updates.push("TrangThai = ?");
    values.push(TrangThai);
  }

  if (LyDoHuy !== undefined) {
    updates.push("LyDoHuy = ?");
    values.push(LyDoHuy);
  }

  if (MaNhanVien !== undefined) {
    updates.push("MaNhanVien = ?");
    values.push(MaNhanVien);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "Không có trường nào để cập nhật" });
  }

  sql += updates.join(", ") + " WHERE MaDonHang = ?";
  values.push(ma);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật" });
  }
});

/* ============================
   5. XÓA ĐƠN HÀNG
============================ */
router.delete("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;

    // ⭐ Để tránh lỗi khóa ngoại, phải xóa chi tiết trước:
    await pool.query(`DELETE FROM DonHangCT WHERE MaDonHang = ?`, [ma]);

    await pool.query(`DELETE FROM DonHang WHERE MaDonHang = ?`, [ma]);

    res.json({ message: "Xóa đơn hàng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi xóa đơn hàng" });
  }
});

export default router;
