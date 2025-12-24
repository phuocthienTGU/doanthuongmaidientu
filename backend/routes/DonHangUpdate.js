// routes/DonHangUpdate.js
import express from "express";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Middleware auth
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    req.user = decoded;
    if (!["nhanvien", "admin"].includes(decoded.vaiTro)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// GET /api/donhang-nhanvien
// Hỗ trợ:
// - ?TrangThai=cho_duyet → lấy đơn chờ duyệt (cho trang dashboard)
// - ?MaNhanVien=USxxx&Ngay=2025-12-24 → lấy đơn của nhân viên trong ngày (cho trang history)
// - Nếu là admin → có thể bỏ qua MaNhanVien để xem tất cả
router.get("/", authMiddleware, async (req, res) => {
  const { TrangThai, MaNhanVien, Ngay } = req.query;

  try {
    let query = `
      SELECT dh.MaDonHang, u.HoTen AS hoTen, dh.TongTien, dh.TrangThai, dh.NgayDat, dh.MaUser
      FROM donhang dh
      LEFT JOIN user u ON dh.MaUser = u.MaUser
    `;
    let params = [];
    let conditions = [];

    // Trường hợp lấy đơn chờ duyệt (dashboard)
    if (TrangThai === "cho_duyet") {
      conditions.push("dh.TrangThai = ?");
      params.push(TrangThai);
    }

    // Trường hợp lấy đơn cá nhân của nhân viên hôm nay (history)
    if (MaNhanVien && Ngay) {
      conditions.push("dh.MaNhanVien = ?");
      params.push(MaNhanVien);
      conditions.push("DATE(dh.NgayDat) = ?");
      params.push(Ngay);

      // Nhân viên chỉ được xem đơn của chính mình
      if (req.user.vaiTro !== "admin" && MaNhanVien !== req.user.MaUser) {
        return res
          .status(403)
          .json({ message: "Không được xem đơn của nhân viên khác" });
      }
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY dh.NgayDat DESC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// PUT /api/donhang-nhanvien/:maDonHang/update
router.put("/:maDonHang/update", authMiddleware, async (req, res) => {
  const { maDonHang } = req.params;
  const { TrangThai, MaNhanVien, LyDoHuy } = req.body;

  const allowedStatuses = ["da_nhan", "dang_giao", "hoan_thanh", "huy"];
  if (!allowedStatuses.includes(TrangThai)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  // Kiểm tra quyền: chỉ nhân viên đã nhận đơn mới được cập nhật tiếp
  try {
    const [orders] = await pool.query(
      `SELECT MaNhanVien, TrangThai FROM donhang WHERE MaDonHang = ?`,
      [maDonHang]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const order = orders[0];

    // Nếu đang nhận đơn (da_nhan) → chỉ nhân viên đó mới được cập nhật
    if (["da_nhan", "dang_giao"].includes(order.TrangThai)) {
      if (order.MaNhanVien !== req.user.MaUser && req.user.vaiTro !== "admin") {
        return res
          .status(403)
          .json({ message: "Bạn không phải người xử lý đơn này" });
      }
    }

    // Nếu là nhận đơn lần đầu
    if (TrangThai === "da_nhan") {
      if (MaNhanVien !== req.user.MaUser) {
        return res
          .status(403)
          .json({ message: "Không thể nhận đơn cho người khác" });
      }
      if (order.TrangThai !== "cho_duyet") {
        return res.status(400).json({ message: "Đơn đã được xử lý" });
      }
    }

    // Cập nhật
    const updateFields = ["TrangThai = ?"];
    const updateParams = [TrangThai];

    if (MaNhanVien) {
      updateFields.push("MaNhanVien = ?");
      updateParams.push(MaNhanVien);
    }
    if (LyDoHuy) {
      updateFields.push("LyDoHuy = ?");
      updateParams.push(LyDoHuy);
    }
    if (TrangThai === "huy") {
      updateFields.push("LyDoHuy = ?");
      updateParams.push(LyDoHuy || "Nhân viên hủy");
    }

    updateParams.push(maDonHang);

    await pool.query(
      `UPDATE donhang SET ${updateFields.join(", ")} WHERE MaDonHang = ?`,
      updateParams
    );

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
