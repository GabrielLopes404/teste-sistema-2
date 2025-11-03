import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/stats", dashboardController.getDashboardStats);
router.get("/relatorios", dashboardController.getRelatorios);

export default router;
