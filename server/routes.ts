import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { type User } from "@shared/schema";

import authRoutes from "./routes/auth.routes";
import contasRoutes from "./routes/contas.routes";
import faturasRoutes from "./routes/faturas.routes";
import contatosRoutes from "./routes/contatos.routes";
import fluxoCaixaRoutes from "./routes/fluxo-caixa.routes";
import conciliacoesRoutes from "./routes/conciliacoes.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import adminRoutes from "./routes/admin.routes";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

import { securityConfig } from "./config/security";
import { provideCsrfToken } from "./middlewares/csrf";

export async function registerRoutes(app: Express): Promise<Server> {
  if (!securityConfig.session.secret) {
    throw new Error("SESSION_SECRET não configurado. Configure SESSION_SECRET no .env");
  }
  
  app.use(session({
    secret: securityConfig.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: securityConfig.session.maxAge,
      sameSite: "strict",
    }
  }));

  app.use(provideCsrfToken);

  app.use("/api/auth", authRoutes);
  app.use("/api/contas", contasRoutes);
  app.use("/api/faturas", faturasRoutes);
  app.use("/api/contatos", contatosRoutes);
  app.use("/api/fluxo-caixa", fluxoCaixaRoutes);
  app.use("/api/conciliacoes", conciliacoesRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/admin", adminRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
