import express from "express";
import { getAllHealthConditions, getHealthConditionDetails, getAllHealthCategories } from "./health.controller";

const router = express.Router();

// GET /health?search=diabetes&category=chronic&page=1&limit=20
router.get("/", getAllHealthConditions);

// GET /health/categories
router.get("/categories", getAllHealthCategories);

// GET /health/:identifier  (slug or healthConditionId)
router.get("/:identifier", getHealthConditionDetails);

export default router;
