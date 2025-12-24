import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Gửi tin nhắn từ user (gửi đến admin → ReceiverMaUser = NULL)
router.post("/send", async (req, res) => {
  try {
    const { MaUser, HoTen, TinNhan } = req.body;

    if (!HoTen || !TinNhan) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    await pool.query(
      "INSERT INTO ChatMessage (MaUser, ReceiverMaUser, HoTen, TinNhan, LaTuUser) VALUES (?, NULL, ?, ?, 1)",
      [MaUser || null, HoTen, TinNhan]
    );

    res.json({ message: "Tin nhắn đã gửi" });
  } catch (err) {
    console.error("Lỗi gửi tin nhắn:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy lịch sử chat – chỉ tin giữa user đang đăng nhập và admin
router.get("/history/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const isGuest = id === "guest" || id === "null" || !id;
    const maUser = isGuest ? null : id;

    let query = `
      SELECT MaTinNhan, MaUser, ReceiverMaUser, HoTen, TinNhan, LaTuUser, ThoiGian 
      FROM ChatMessage 
      WHERE 
        (MaUser = ? AND ReceiverMaUser IS NULL)      -- Tin user gửi cho admin
        OR (MaUser IS NULL AND ReceiverMaUser = ?)   -- Tin admin gửi cho user
        OR (MaUser IS NULL AND ReceiverMaUser IS NULL AND ? IS NULL)  -- Tin chung chỉ cho guest
      ORDER BY ThoiGian ASC
    `;
    let params = [maUser, maUser, maUser]; // lặp maUser cho các điều kiện

    if (isGuest) {
      // Guest chỉ thấy tin chung (nếu có) + tin admin gửi chung
      query = `
        SELECT MaTinNhan, MaUser, ReceiverMaUser, HoTen, TinNhan, LaTuUser, ThoiGian 
        FROM ChatMessage 
        WHERE MaUser IS NULL AND ReceiverMaUser IS NULL
        ORDER BY ThoiGian ASC
      `;
      params = [];
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy lịch sử chat:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ADMIN: Lấy danh sách user đã chat (chỉ user đăng nhập)
router.get("/admin/users", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT MaUser, HoTen 
      FROM ChatMessage 
      WHERE MaUser IS NOT NULL 
      GROUP BY MaUser
      ORDER BY MAX(ThoiGian) DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// ADMIN: Trả lời riêng cho user (ReceiverMaUser = MaUser của user)
router.post("/admin/reply", async (req, res) => {
  try {
    const { MaUser, TinNhan } = req.body;

    if (!MaUser || !TinNhan) {
      return res.status(400).json({ message: "Thiếu MaUser hoặc TinNhan" });
    }

    await pool.query(
      "INSERT INTO ChatMessage (MaUser, ReceiverMaUser, HoTen, TinNhan, LaTuUser) VALUES (NULL, ?, 'Jollibee Support', ?, 0)",
      [MaUser, TinNhan]
    );

    res.json({ message: "Đã trả lời riêng" });
  } catch (err) {
    console.error("Lỗi admin reply:", err);
    res.status(500).json({ message: "Lỗi server khi trả lời" });
  }
});
export default router;
