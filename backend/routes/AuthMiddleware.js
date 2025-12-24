const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Không có token!" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.VaiTro !== "admin")
    return res.status(403).json({ message: "Bạn không có quyền Admin!" });
  next();
}

function isNhanVien(req, res, next) {
  if (req.user.VaiTro !== "nhanvien" && req.user.VaiTro !== "admin")
    return res.status(403).json({ message: "Bạn không có quyền Nhân viên!" });
  next();
}

module.exports = { verifyToken, isAdmin, isNhanVien };
