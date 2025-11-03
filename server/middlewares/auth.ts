import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export const requireAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Não autorizado" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Não autorizado" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Erro de autenticação" });
  }
};

export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado: apenas administradores" });
  }
  next();
};

export const optionalAuth = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.session?.userId) {
      const user = await storage.getUser(req.session.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
