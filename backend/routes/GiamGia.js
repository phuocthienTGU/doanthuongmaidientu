import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// LẤY TẤT CẢ MÃ GIẢM GIÁ (cho admin - route này dùng cho trang admin)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM GiamGia ORDER BY NgayBatDau DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy danh sách khuyến mãi:", err);
    res.status(500).json({ message: "Lỗi server khi lấy khuyến mãi" });
  }
});

// LẤY MÃ GIẢM GIÁ ĐANG HIỂN THỊ (cho frontend người dùng)
router.get("/active", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM GiamGia WHERE TrangThai = 'hienthi' AND CURDATE() BETWEEN NgayBatDau AND NgayHetHan"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// KIỂM TRA MÃ GIẢM GIÁ (giữ nguyên)
router.get("/check/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const [rows] = await pool.query(
      "SELECT PhanTram FROM GiamGia WHERE MaGiamGia = ? AND TrangThai = 'hienthi' AND CURDATE() BETWEEN NgayBatDau AND NgayHetHan",
      [ma]
    );
    if (rows.length === 0) return res.json({ valid: false });
    res.json({ valid: true, phanTram: rows[0].PhanTram });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { MaGiamGia, PhanTram, NgayBatDau, NgayHetHan, MoTa, GiaToiThieu } =
      req.body;

    if (!MaGiamGia || !PhanTram || !NgayBatDau || !NgayHetHan) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Không cho phép ký tự đặc biệt trong mã
    if (/[%&?=#]/.test(MaGiamGia)) {
      return res.status(400).json({
        message: "Mã giảm giá không được chứa ký tự đặc biệt như % & ? = #",
      });
    }

    // Kiểm tra mã tồn tại
    const [exists] = await pool.query(
      "SELECT * FROM GiamGia WHERE MaGiamGia = ?",
      [MaGiamGia]
    );
    if (exists.length > 0) {
      return res.status(409).json({ message: "Mã giảm giá đã tồn tại!" });
    }

    await pool.query(
      "INSERT INTO GiamGia (MaGiamGia, PhanTram, NgayBatDau, NgayHetHan, MoTa, GiaToiThieu, TrangThai) VALUES (?, ?, ?, ?, ?, ?, 'hienthi')",
      [
        MaGiamGia,
        PhanTram,
        NgayBatDau,
        NgayHetHan,
        MoTa || null,
        GiaToiThieu || null,
      ]
    );

    res.json({ message: "Thêm mã giảm giá thành công" });
  } catch (err) {
    console.error("Lỗi thêm:", err);
    res.status(500).json({ message: "Lỗi server khi thêm: " + err.message });
  }
});
// SỬA MÃ GIẢM GIÁ (PUT)
router.put("/:ma", async (req, res) => {
  try {
    const { ma } = req.params;
    const { PhanTram, NgayBatDau, NgayHetHan, MoTa, GiaToiThieu } = req.body;

    await pool.query(
      "UPDATE GiamGia SET PhanTram=?, NgayBatDau=?, NgayHetHan=?, MoTa=?, GiaToiThieu=? WHERE MaGiamGia=?",
      [PhanTram, NgayBatDau, NgayHetHan, MoTa || null, GiaToiThieu || null, ma]
    );

    res.json({ message: "Cập nhật mã giảm giá thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật" });
  }
});

// XÓA (ẨN) MÃ GIẢM GIÁ - ĐÃ THÊM LOG CHI TIẾT
router.delete("/:ma", async (req, res) => {
  const { ma } = req.params;
  try {
    console.log(`Đang ẩn mã giảm giá: ${ma}`);

    // Kiểm tra mã có tồn tại không
    const [exists] = await pool.query(
      "SELECT * FROM GiamGia WHERE MaGiamGia = ?",
      [ma]
    );
    if (exists.length === 0) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại!" });
    }

    const [result] = await pool.query(
      "UPDATE GiamGia SET TrangThai='an' WHERE MaGiamGia=?",
      [ma]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không thể ẩn mã giảm giá" });
    }

    console.log(`Ẩn thành công mã: ${ma}`);
    res.json({ message: "Ẩn mã giảm giá thành công" });
  } catch (err) {
    console.error("Lỗi ẩn mã giảm giá:", err);
    res.status(500).json({ message: "Lỗi server khi ẩn: " + err.message });
  }
});
router.put("/:ma/toggle-status", async (req, res) => {
  try {
    const { ma } = req.params;
    const [rows] = await pool.query(
      "SELECT TrangThai FROM GiamGia WHERE MaGiamGia = ?",
      [ma]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Mã không tồn tại" });

    const current = rows[0].TrangThai;
    const newStatus = current === "hienthi" ? "an" : "hienthi";

    await pool.query("UPDATE GiamGia SET TrangThai = ? WHERE MaGiamGia = ?", [
      newStatus,
      ma,
    ]);

    res.json({
      message:
        newStatus === "hienthi"
          ? "Hiển thị lại thành công"
          : "Ẩn mã thành công",
      newStatus,
    });
  } catch (err) {
    console.error("Lỗi toggle:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
export default router;
