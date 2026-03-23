import express from "express";
import { search, advanceSearch } from "./search.controller";

const router = express.Router();

// GET /search?q=pumpkin
router.get("/", search);

// GET /search/advance-search?q=pumpkin — lightweight, returns only key fields
router.get("/advance-search", advanceSearch);

export default router;
