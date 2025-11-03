import { Router } from "express";
import * as contatosController from "../controllers/contatos.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(requireAuth);

router.get("/", contatosController.getContatos);
router.get("/stats", contatosController.getContatosStats);
router.get("/:id", contatosController.getContato);
router.post("/", contatosController.createContato);
router.put("/:id", contatosController.updateContato);
router.delete("/:id", contatosController.deleteContato);

export default router;
