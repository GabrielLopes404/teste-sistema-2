import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/stats", adminController.getAdminStats);

export default router;
