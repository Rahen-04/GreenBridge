import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import farmerRoutes from "./routes/farmers.js";
import orderRoutes from "./routes/orders.js";
import cartRoutes from "./routes/cart.js";
import reviewRoutes from "./routes/reviews.js";
import contactRoutes from "./routes/contact.js";
import pricingRoutes from "./routes/pricing.js";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  console.warn("[WARN] JWT_SECRET is not set. Using local development fallback.");
  process.env.JWT_SECRET = "greenbridge_default_jwt_secret_key_2026";
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));

// Rate limit authentication attempts to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many authentication requests, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/pricing", pricingRoutes);

// In production, serve the Vite build if dist directory exists
const distPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`GreenBridge API running on http://localhost:${PORT}`);
});
