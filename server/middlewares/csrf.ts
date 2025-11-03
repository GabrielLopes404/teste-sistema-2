import { Request, Response, NextFunction } from "express";
import { randomBytes, createHmac } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString("hex");
const CSRF_TOKEN_LENGTH = 32;

export function generateCsrfToken(): string {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
  return token;
}

export function createCsrfHash(token: string): string {
  return createHmac("sha256", CSRF_SECRET)
    .update(token)
    .digest("hex");
}

export function verifyCsrfToken(token: string, hash: string): boolean {
  const expectedHash = createCsrfHash(token);
  return expectedHash === hash;
}

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }

  if (!req.session) {
    return res.status(403).json({ message: "Sessão não encontrada" });
  }

  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  const token = req.headers["x-csrf-token"] as string || req.body._csrf;

  if (!token) {
    return res.status(403).json({ 
      message: "Token CSRF ausente" 
    });
  }

  const isValid = verifyCsrfToken(token, createCsrfHash(req.session.csrfToken));

  if (!isValid) {
    return res.status(403).json({ 
      message: "Token CSRF inválido" 
    });
  }

  next();
};

export const provideCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && !req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  if (req.session?.csrfToken) {
    res.setHeader("X-CSRF-Token", req.session.csrfToken);
  }

  next();
};

declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}
