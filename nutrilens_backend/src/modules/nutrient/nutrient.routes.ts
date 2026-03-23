import express from "express";
import { getAllNutrients, getNutrientDetails } from "./nutrient.controller";

const router = express.Router();

// GET /nutrients?search=   → list all nutrients (optional search)
// GET /nutrients/:identifier → nutrient detail by nutritionId or slug
router.get("/", getAllNutrients);
router.get("/:identifier", getNutrientDetails);

export default router;
