import { Router } from "express";
import { query, pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id,status,total,created_at FROM orders
       WHERE user_id=$1 ORDER BY created_at DESC`,
      [req.user.sub]
    );
    res.json({ success: true, data: result.rows, message: "โหลดคำสั่งซื้อสำเร็จ" });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const cart = await client.query(
      `SELECT c.product_id,c.qty,p.name,p.price,p.stock
       FROM carts c JOIN products p ON p.id=c.product_id
       WHERE c.user_id=$1 FOR UPDATE`,
      [req.user.sub]
    );

    if (!cart.rowCount) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        error: { code: "EMPTY_CART", message: "ตะกร้าสินค้าว่าง" }
      });
    }

    for (const item of cart.rows) {
      if (item.qty > item.stock) {
        await client.query("ROLLBACK");
        return res.status(409).json({
          success: false,
          error: { code: "OUT_OF_STOCK", message: `สินค้า ${item.name} มีไม่เพียงพอ` }
        });
      }
    }

    const total = cart.rows.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const order = await client.query(
      `INSERT INTO orders(user_id,status,total) VALUES ($1,'pending',$2) RETURNING id,status,total,created_at`,
      [req.user.sub, total]
    );

    for (const item of cart.rows) {
      await client.query(
        `INSERT INTO order_items(order_id,product_id,qty,price) VALUES ($1,$2,$3,$4)`,
        [order.rows[0].id, item.product_id, item.qty, item.price]
      );
      await client.query(
        `UPDATE products SET stock=stock-$1, updated_at=NOW() WHERE id=$2`,
        [item.qty, item.product_id]
      );
    }

    await client.query("DELETE FROM carts WHERE user_id=$1", [req.user.sub]);
    await client.query("COMMIT");

    res.status(201).json({ success: true, data: order.rows[0], message: "สร้างคำสั่งซื้อสำเร็จ" });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
});

export default router;
