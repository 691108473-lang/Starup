export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "ไม่พบข้อมูลหรือเส้นทางที่ร้องขอ" }
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" }
  });
}
