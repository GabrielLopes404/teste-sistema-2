export const securityConfig = {
  bcrypt: {
    rounds: 12,
  },
  
  jwt: {
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  },
  
  session: {
    secret: process.env.SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  
  encryption: {
    key: process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY.substring(0, 32) : undefined,
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5000",
    credentials: true,
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    loginMax: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || "5", 10),
  },
  
  upload: {
    allowedMimeTypes: [
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxFileSize: 5 * 1024 * 1024,
  },
};

export function validateSecurityConfig(): void {
  const requiredEnvVars = [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET", 
    "SESSION_SECRET",
    "ENCRYPTION_KEY",
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `⚠️  ERRO DE SEGURANÇA CRÍTICO: Variáveis de ambiente obrigatórias não configuradas: ${missing.join(", ")}\n` +
      `Por favor, configure todas as variáveis no arquivo .env antes de iniciar o servidor.\n` +
      `Veja .env.example para referência.`
    );
  }

  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 32) {
    throw new Error(
      `⚠️  ERRO DE SEGURANÇA: ENCRYPTION_KEY deve ter pelo menos 32 caracteres para AES-256.\n` +
      `Atual: ${process.env.ENCRYPTION_KEY.length} caracteres.`
    );
  }

  const minKeyLength = 32;
  const secrets = [
    { name: "ACCESS_TOKEN_SECRET", value: process.env.ACCESS_TOKEN_SECRET },
    { name: "REFRESH_TOKEN_SECRET", value: process.env.REFRESH_TOKEN_SECRET },
    { name: "SESSION_SECRET", value: process.env.SESSION_SECRET },
  ];

  for (const secret of secrets) {
    if (secret.value && secret.value.length < minKeyLength) {
      throw new Error(
        `⚠️  ERRO DE SEGURANÇA: ${secret.name} deve ter pelo menos ${minKeyLength} caracteres.\n` +
        `Atual: ${secret.value.length} caracteres.`
      );
    }
  }

  console.log("✅ Configuração de segurança validada com sucesso");
}
