import { Router } from "express";
import { query } from "../db/pool.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim();
    const limit = Math.min(Number(req.query.limit) || 24, 100);

    const params = [];
    const where = ["p.status = 'active'"];

    if (q) {
      params.push(`%${q}%`);
      where.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }
    if (category) {
      params.push(category);
      where.push(`c.name = $${params.length}`);
    }

    params.push(limit);
    const result = await query(
      `SELECT p.id,p.name,p.description,p.price,p.stock,p.image_url,c.name AS category
       FROM products p
       LEFT JOIN categories c ON c.id=p.category_id
       WHERE ${where.join(" AND ")}
       ORDER BY p.created_at DESC
       LIMIT $${params.length}`,
      params
    );

    res.json({ success: true, data: result.rows, message: "โหลดสินค้าสำเร็จ" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await query(
      `SELECT p.*, c.name AS category
       FROM products p LEFT JOIN categories c ON c.id=p.category_id
       WHERE p.id=$1 AND p.status='active'`,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({
        success: false,
        error: { code: "PRODUCT_NOT_FOUND", message: "ไม่พบสินค้า" }
      });
    }

    res.json({ success: true, data: result.rows[0], message: "โหลดสินค้าสำเร็จ" });
  } catch (err) {
    next(err);
  }
});

export default router;
