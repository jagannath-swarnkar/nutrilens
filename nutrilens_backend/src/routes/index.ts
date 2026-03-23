import express from "express";

import authRoutes from "../modules/auth/auth.routes";
import foodRoutes from "../modules/food/food.routes";
import healthRoutes from "../modules/health/health.routes";
import nutrientRoutes from "../modules/nutrient/nutrient.routes";
import searchRoutes from "../modules/search/search.routes";
const router = express.Router();

// ─── Modules ─────────────────────────────────────────────────────────────────
router.use("/", authRoutes);               // POST /login  POST /signup  GET /profile
router.use("/foods", foodRoutes);          // GET/POST/PATCH/DELETE /foods
router.use("/nutrients", nutrientRoutes);  // GET /nutrients  GET /nutrients/:name/foods
router.use("/health", healthRoutes); // GET/POST/PATCH/DELETE /health/conditions
router.use("/search", searchRoutes);       // GET /search?q=&type=
export default router;
