import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Gửi góp ý từ user
router.post("/send", async (req, res) => {
  try {
    const { MaUser, HoTen, DienThoai, Email, LoaiGopY, NoiDung } = req.body;

    if (!HoTen || !DienThoai || !LoaiGopY || !NoiDung) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    await pool.query(
      `INSERT INTO Feedback (MaUser, HoTen, DienThoai, Email, LoaiGopY, NoiDung)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [MaUser || null, HoTen, DienThoai, Email || null, LoaiGopY, NoiDung]
    );

    res.json({ message: "Góp ý đã gửi thành công!" });
  } catch (err) {
    console.error("Lỗi gửi góp ý:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ADMIN: Lấy list góp ý
router.get("/admin/list", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Feedback ORDER BY ThoiGian DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy list góp ý:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ADMIN: Reply góp ý (cập nhật AdminReply và TrangThai)
router.post("/admin/reply/:maFeedback", async (req, res) => {
  try {
    const { maFeedback } = req.params;
    const { AdminReply } = req.body;

    if (!AdminReply) return res.status(400).json({ message: "Thiếu phản hồi" });

    await pool.query(
      "UPDATE Feedback SET AdminReply = ?, TrangThai = 'da_giai_quyet' WHERE MaFeedback = ?",
      [AdminReply, maFeedback]
    );

    res.json({ message: "Đã trả lời góp ý" });
  } catch (err) {
    console.error("Lỗi reply góp ý:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
