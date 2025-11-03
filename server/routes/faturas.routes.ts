import { Router } from "express";
import * as faturasController from "../controllers/faturas.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/", faturasController.getFaturas);
router.get("/stats", faturasController.getFaturasStats);
router.get("/:id", faturasController.getFatura);
router.post("/", faturasController.createFatura);
router.put("/:id", faturasController.updateFatura);
router.delete("/:id", faturasController.deleteFatura);

export default router;
