import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { securityConfig } from "../config/security";
import { Request, Response, NextFunction } from "express";
import { createAuditLog } from "../utils/audit-logger";

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
  frameguard: { action: "deny" },
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === "development") {
      callback(null, true);
      return;
    }

    const allowedOrigins = [
      securityConfig.cors.origin,
      process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : null,
      process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : null,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS bloqueado para origin: ${origin}`);
      callback(new Error("Não permitido pelo CORS"));
    }
  },
  credentials: securityConfig.cors.credentials,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  exposedHeaders: ["X-CSRF-Token"],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

export const generalRateLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.windowMs,
  max: securityConfig.rateLimit.maxRequests,
  message: { message: "Muitas requisições deste IP, tente novamente mais tarde" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    createAuditLog({
      action: "RATE_LIMIT_EXCEEDED",
      resource: "api",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      status: "failure",
      details: { path: req.path, method: req.method },
    });
    res.status(429).json({ 
      message: "Muitas requisições deste IP, tente novamente mais tarde" 
    });
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: securityConfig.rateLimit.windowMs,
  max: securityConfig.rateLimit.loginMax,
  skipSuccessfulRequests: true,
  message: { 
    message: "Muitas tentativas de login. Por favor, aguarde 15 minutos." 
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    createAuditLog({
      action: "LOGIN_RATE_LIMIT_EXCEEDED",
      resource: "auth",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      status: "failure",
      details: { 
        username: req.body?.username,
        path: req.path,
      },
    });
    res.status(429).json({ 
      message: "Muitas tentativas de login. Por favor, aguarde 15 minutos." 
    });
  },
});

export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  
  return input;
}

export const sanitizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
};

export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === "string") {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (Array.isArray(value)) {
      return value.some(checkValue);
    }
    if (typeof value === "object" && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  const allInputs = { ...req.body, ...req.query, ...req.params };
  
  if (checkValue(allInputs)) {
    createAuditLog({
      action: "SQL_INJECTION_ATTEMPT",
      resource: "api",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      status: "failure",
      details: { 
        path: req.path,
        method: req.method,
      },
    });
    return res.status(400).json({ 
      message: "Entrada inválida detectada" 
    });
  }
  
  next();
};
