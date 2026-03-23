import express from "express";
import { BasicAuth } from "../../utils/BasicAuth";
import { AuthGuard } from "../../utils/AuthGuard";
import { login, signup, getProfile } from "./auth.controller";

const router = express.Router();

router.post("/login", BasicAuth, login);
router.post("/signup", BasicAuth, signup);
router.get("/profile", [AuthGuard], getProfile);

export default router;
