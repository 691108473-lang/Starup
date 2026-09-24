import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",").map(v => v.trim()) || true
}));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/api/health", (req,res) => {
  res.json({ success: true, data: { status: "ok", service: "marketplace-api" }, message: "ระบบพร้อมใช้งาน" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Marketplace API running on http://localhost:${PORT}`);
});
