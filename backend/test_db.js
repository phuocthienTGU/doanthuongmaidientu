import pool from "./config/db.js";

try {
  const [rows] = await pool.query("SELECT 1 + 1 AS solution");
  console.log("Kết nối DB thành công:", rows);
} catch (err) {
  console.error("Lỗi kết nối DB:", err);
}
