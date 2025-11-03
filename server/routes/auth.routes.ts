import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth";
import { loginRateLimiter } from "../middlewares/security";

const router = Router();

router.post("/login", loginRateLimiter, authController.login);
router.post("/register", loginRateLimiter, authController.register);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.getMe);
router.put("/profile", requireAuth, authController.updateProfile);

export default router;
