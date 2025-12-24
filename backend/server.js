// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import SanPhamRouter from "./routes/sanpham.js";
import imagesRouter from "./routes/images.js";

import ComboRouter from "./routes/Combo.js";
import AuthRouter from "./routes/Auth.js";
import DanhMucRouter from "./routes/DanhMuc.js";
import orderRouter from "./routes/order.js";
import DonHangRouter from "./routes/DonHang.js";
import DonHangChiTietRouter from "./routes/DonHangChiTiet.js";
//import UserRouter from "./routes/User.js";
import XaRouter from "./routes/Xa.js";
//import ChiTietDonHangRouter from "./routes/ChiTietDonHang.js";
import giamGiaRouter from "./routes/GiamGia.js";
import giohangRouter from "./routes/giohang.js";
import chatRouter from "./routes/Chat.js";
import FeedbackRouter from "./routes/Feedback.js"; // Thêm import
import DonHangUpdateRouter from "./routes/DonHangUpdate.js";
import danhGiaRouter from "./routes/DanhGia.js";

// Load biến môi trường .env
// Load biến môi trường .env
dotenv.config();
const app = express();

// Fix __dirname khi dùng ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Thư mục frontend public
const publicPath = path.resolve(__dirname, "../my-new-app/public");

// Cấu hình nơi lưu ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images")); // Lưu vào backend/images
  },
  filename: (req, file, cb) => {
    // Tên file an toàn: thêm thời gian để tránh trùng
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "sanpham-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Chỉ chấp nhận file ảnh!"));
  },
});

// Thư mục images (chứa ảnh sản phẩm) - BẮT BUỘC PHẢI CÓ DÒNG NÀY
const imagesPath = path.join(__dirname, "images");

// Phục vụ file tĩnh
app.use(express.static(publicPath));

// PHỤC VỤ ẢNH - ĐẶT TRƯỚC cors() là OK, nhưng phải sau khi khai báo imagesPath
app.use("/images", express.static(imagesPath));
console.log("Thư mục ảnh được phục vụ tại: /images →", imagesPath);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());
// debug log API requests
app.use("/api", (req, res, next) => {
  console.log("[API REQUEST]", req.method, req.originalUrl);
  next();
});
// Route upload (moved after CORS so browser clients get CORS headers)
app.post("/api/upload", upload.single("hinhanh"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không có file được upload" });
  }
  res.json({ filename: req.file.filename });
});
// quick health test route
app.get("/api/_test_images", (req, res) => res.json({ ok: true }));
// list images
app.use("/api/images", imagesRouter);
// Định nghĩa route API
app.use("/auth", AuthRouter);

app.use("/api/chat", chatRouter);
app.use("/api/giamgia", giamGiaRouter);

app.use("/api/danhgia", danhGiaRouter);
app.use("/api/xa", XaRouter);
app.use("/api/sanpham", SanPhamRouter);
app.use("/api/combo", ComboRouter);
app.use("/api/danhmuc", DanhMucRouter);

app.use("/api/order", orderRouter);

app.use("/api/donhang", DonHangRouter);
app.use("/api/donhangchitiet", DonHangChiTietRouter);
//app.use("/api/user", UserRouter);
//app.use("/api/chitietdonhang", ChiTietDonHangRouter);
app.use("/api/giohang", giohangRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/feedback", FeedbackRouter); // Thêm route

app.use("/api/donhang-nhanvien", DonHangUpdateRouter);
// Test server
app.get("/", (req, res) => {
  res.send("Server Jollibee Backend đang chạy!");
});

// Nếu có PORT trong .env → dùng, không có thì dùng 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
