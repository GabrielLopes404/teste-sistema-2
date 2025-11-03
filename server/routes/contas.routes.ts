import { Router } from "express";
import * as contasController from "../controllers/contas.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/", contasController.getContas);
router.get("/stats", contasController.getContasStats);
router.get("/:id", contasController.getConta);
router.post("/", contasController.createConta);
router.put("/:id", contasController.updateConta);
router.delete("/:id", contasController.deleteConta);

export default router;
