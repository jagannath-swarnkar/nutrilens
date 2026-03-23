import express from "express";
import { getAllCategories, getAllFoods, getFoodBySlugOrFoodId } from "./food.controller";

const router = express.Router();

// GET /food?search=apple&category=fruit&tag=heart_healthy&page=1&limit=20
router.get("/", getAllFoods);

// GET /food/categories
router.get("/categories", getAllCategories);

// GET /food/:identifier  (slug or foodId)
router.get("/:identifier", getFoodBySlugOrFoodId);


export default router;
