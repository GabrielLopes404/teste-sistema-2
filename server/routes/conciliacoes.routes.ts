import { Router } from "express";
import * as conciliacoesController from "../controllers/conciliacoes.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/", conciliacoesController.getConciliacoes);
router.get("/:id", conciliacoesController.getConciliacao);
router.post("/", conciliacoesController.createConciliacao);
router.put("/:id", conciliacoesController.updateConciliacao);
router.delete("/:id", conciliacoesController.deleteConciliacao);

export default router;
