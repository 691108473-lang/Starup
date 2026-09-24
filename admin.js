import { Router } from "express";
import { query } from "../db/pool.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", requireAuth, requireRoles("admin","super_admin","staff"), async (req,res,next) => {
  try {
    const [users, orders, revenue, products] = await Promise.all([
      query("SELECT COUNT(*)::int AS count FROM users"),
      query("SELECT COUNT(*)::int AS count FROM orders"),
      query("SELECT COALESCE(SUM(total),0)::numeric AS total FROM orders WHERE status IN ('paid','processing','shipped','delivered')"),
      query("SELECT COUNT(*)::int AS count FROM products WHERE status='active'")
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: users.rows[0].count,
        totalOrders: orders.rows[0].count,
        revenue: revenue.rows[0].total,
        activeProducts: products.rows[0].count
      },
      message: "โหลด Dashboard สำเร็จ"
    });
  } catch (err) {
    next(err);
  }
});

export default router;
