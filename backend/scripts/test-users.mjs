import db from "../config/db.js";

(async () => {
  try {
    const [rows] = await db.query(
      `SELECT MaUser, TaiKhoan FROM user ORDER BY MaUser DESC LIMIT 5`
    );
    console.log("OK rows:", rows);
  } catch (e) {
    console.error("DB ERR", e);
  } finally {
    process.exit(0);
  }
})();
