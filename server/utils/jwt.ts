import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { securityConfig } from "../config/security";

if (!securityConfig.jwt.accessTokenSecret || !securityConfig.jwt.refreshTokenSecret) {
  throw new Error("JWT secrets não configurados. Configure ACCESS_TOKEN_SECRET e REFRESH_TOKEN_SECRET no .env");
}

const ACCESS_TOKEN_SECRET = securityConfig.jwt.accessTokenSecret!;
const REFRESH_TOKEN_SECRET = securityConfig.jwt.refreshTokenSecret!;
const ACCESS_TOKEN_EXPIRY = securityConfig.jwt.accessTokenExpiry;
const REFRESH_TOKEN_EXPIRY = securityConfig.jwt.refreshTokenExpiry;

interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  tokenId?: string;
}

export interface RefreshToken {
  userId: string;
  tokenId: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
}

const refreshTokenStore = new Map<string, RefreshToken>();

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(
    {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function generateRefreshToken(payload: TokenPayload): { token: string; tokenId: string } {
  const tokenId = randomUUID();
  const token = jwt.sign(
    {
      userId: payload.userId,
      tokenId,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  refreshTokenStore.set(tokenId, {
    userId: payload.userId,
    tokenId,
    expiresAt,
    createdAt: new Date(),
  });

  return { token, tokenId };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    
    if (!decoded.tokenId) {
      return null;
    }

    const storedToken = refreshTokenStore.get(decoded.tokenId);
    
    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export function revokeRefreshToken(tokenId: string): boolean {
  const token = refreshTokenStore.get(tokenId);
  if (token) {
    token.revokedAt = new Date();
    refreshTokenStore.set(tokenId, token);
    return true;
  }
  return false;
}

export function revokeAllUserTokens(userId: string): void {
  refreshTokenStore.forEach((token, tokenId) => {
    if (token.userId === userId) {
      token.revokedAt = new Date();
      refreshTokenStore.set(tokenId, token);
    }
  });
}

export function cleanExpiredTokens(): void {
  const now = new Date();
  refreshTokenStore.forEach((token, tokenId) => {
    if (token.expiresAt < now) {
      refreshTokenStore.delete(tokenId);
    }
  });
}

setInterval(cleanExpiredTokens, 1000 * 60 * 60);
