import { Router } from "express";
import * as fluxoCaixaController from "../controllers/fluxo-caixa.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/", fluxoCaixaController.getFluxoCaixa);
router.get("/stats", fluxoCaixaController.getFluxoCaixaStats);
router.post("/", fluxoCaixaController.createFluxoCaixa);

export default router;
