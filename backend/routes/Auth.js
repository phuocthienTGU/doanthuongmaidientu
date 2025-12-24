import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Gio hang API dang hoat dong",
    huongDan: "Dung /api/giohang/user/:maUser",
  });
});

// 📌 API ĐĂNG KÝ (SIGN UP)
router.post("/signup", async (req, res) => {
  try {
    const { TaiKhoan, MatKhau, HoTen, Email, DienThoai, DiaChi, MaXa, VaiTro } =
      req.body;

    if (!TaiKhoan || !MatKhau || !HoTen) {
      return res.status(400).json({ message: "Thiếu dữ liệu!" });
    }

    const [exists] = await db.query("SELECT * FROM user WHERE TaiKhoan = ?", [
      TaiKhoan,
    ]);
    if (exists.length > 0)
      return res.status(409).json({ message: "Tài khoản đã tồn tại!" });

    await db.query(
      `INSERT INTO user 
      (TaiKhoan, MatKhau, HoTen, Email, DienThoai, DiaChi, MaXa, VaiTro) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        TaiKhoan,
        MatKhau,
        HoTen,
        Email,
        DienThoai,
        DiaChi || null,
        MaXa || null,
        VaiTro,
      ]
    );

    res.json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// ================= ADMIN =================

// ADMIN - lấy danh sách người dùng
router.get("/admin/users", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        MaUser,
        TaiKhoan,
        HoTen,
        Email,
        DienThoai,

        DiaChi,
        VaiTro,
        NgayTao,
        MaXa
      FROM user
      ORDER BY MaUser DESC
    `);

    res.json(rows); // ⚠️ TRẢ VỀ MẢNG
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách user" });
  }
});

// ADMIN - disable user (soft-disable to avoid FK constraint errors)
/*router.put("/admin/users/:maUser/disable", async (req, res) => {
  try {
    const { maUser } = req.params;

    const [result] = await db.query(
      "UPDATE user SET VaiTro = ? WHERE MaUser = ?",
      ["disabled", maUser]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy user!" });
    }

    res.json({ message: "Đã vô hiệu hóa người dùng" });
  } catch (err) {
    console.error("Lỗi disable user:", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});*/
// 📌 API ĐĂNG NHẬP (LOGIN)
router.post("/login", async (req, res) => {
  try {
    console.log("Body login:", req.body);
    const { TaiKhoan, MatKhau } = req.body;

    const [users] = await db.query("SELECT * FROM user WHERE TaiKhoan = ?", [
      TaiKhoan,
    ]);
    console.log("Users found:", users);

    if (users.length === 0)
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });

    const user = users[0];
    console.log("User:", user);

    const isMatch = MatKhau === user.MatKhau;
    console.log("Password match:", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu!" });

    const token = jwt.sign(
      {
        MaUser: user.MaUser,
        VaiTro: user.VaiTro,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        MaUser: user.MaUser,
        HoTen: user.HoTen,
        VaiTro: user.VaiTro,
        Email: user.Email,
        DienThoai: user.DienThoai,
        DiaChi: user.DiaChi,
        MaXa: user.MaXa,
        NgayTao: user.NgayTao,
      },
    });
  } catch (err) {
    console.error("Lỗi login:", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// 📌 API LẤY THÔNG TIN MỘT USER THEO MaUser (dùng cho hiển thị nhân viên giao hàng)
router.get("/user/:maUser", async (req, res) => {
  try {
    const { maUser } = req.params;

    const [rows] = await db.query(
      `SELECT MaUser, HoTen, DienThoai, Email, VaiTro 
       FROM user 
       WHERE MaUser = ?`,
      [maUser]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Lỗi lấy thông tin user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// ================= ADMIN - CẬP NHẬT USER =================
router.put("/admin/users/:maUser", async (req, res) => {
  try {
    const { maUser } = req.params;
    const {
      TaiKhoan,
      MatKhau, // Nếu có nhập mới thì đổi, không thì giữ nguyên
      HoTen,
      Email,
      DienThoai,
      DiaChi,
      VaiTro,
      MaXa,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!TaiKhoan || !HoTen || !VaiTro) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc: Tài khoản, Họ tên hoặc Vai trò!",
      });
    }

    // Kiểm tra trùng Tài khoản (trừ chính nó)
    const [existing] = await db.query(
      "SELECT MaUser FROM user WHERE TaiKhoan = ? AND MaUser != ?",
      [TaiKhoan, maUser]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Tài khoản đã tồn tại!" });
    }

    let sql = `UPDATE user SET 
                TaiKhoan = ?, 
                HoTen = ?, 
                Email = ?, 
                DienThoai = ?, 
                DiaChi = ?, 
                VaiTro = ?, 
                MaXa = ?`;
    let values = [
      TaiKhoan,
      HoTen,
      Email || null,
      DienThoai || null,
      DiaChi || null,
      VaiTro,
      MaXa || null,
    ];

    // Nếu có mật khẩu mới → hash và cập nhật
    if (MatKhau && MatKhau.trim() !== "") {
      const hashedPassword = await bcrypt.hash(MatKhau.trim(), 10);
      sql += `, MatKhau = ?`;
      values.push(hashedPassword);
    }

    sql += ` WHERE MaUser = ?`;
    values.push(maUser);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res.json({ message: "Cập nhật người dùng thành công!" });
  } catch (err) {
    console.error("Lỗi cập nhật user:", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// ================= ADMIN - XÓA USER (an toàn với FK) =================
router.delete("/admin/users/:maUser", async (req, res) => {
  try {
    const { maUser } = req.params;

    // Kiểm tra xem user có tồn tại không
    const [userCheck] = await db.query(
      "SELECT MaUser FROM user WHERE MaUser = ?",
      [maUser]
    );
    if (userCheck.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Kiểm tra ràng buộc: có đơn hàng, giỏ hàng, đánh giá, feedback...
    const relatedTables = [
      "donhang",
      "giohang",
      "danhgia",
      "feedback",
      "chatmessage",
    ];

    for (const table of relatedTables) {
      const [related] = await db.query(
        `SELECT 1 FROM ${table} WHERE MaUser = ? LIMIT 1`,
        [maUser]
      );
      if (related.length > 0) {
        return res.status(400).json({
          message: `Không thể xóa: Người dùng đang có dữ liệu liên quan trong bảng ${table}!`,
        });
      }
    }

    // Nếu không có ràng buộc → xóa thật
    await db.query("DELETE FROM user WHERE MaUser = ?", [maUser]);

    res.json({ message: "Xóa người dùng thành công!" });
  } catch (err) {
    console.error("Lỗi xóa user:", err);

    // Xử lý lỗi FK cụ thể
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        message:
          "Không thể xóa: Người dùng đang có đơn hàng, giỏ hàng hoặc dữ liệu liên quan!",
      });
    }

    res.status(500).json({ message: "Lỗi server!" });
  }
});
// QUAN TRỌNG: ESM phải export default
export default router;
