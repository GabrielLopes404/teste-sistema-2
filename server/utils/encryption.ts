import CryptoJS from "crypto-js";
import { securityConfig } from "../config/security";

if (!securityConfig.encryption.key) {
  throw new Error("ENCRYPTION_KEY não configurada. Configure ENCRYPTION_KEY no .env com exatamente 32 caracteres");
}

const ENCRYPTION_KEY = securityConfig.encryption.key;

export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

export function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashSensitiveData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

export function encryptObject(obj: Record<string, any>): string {
  const jsonString = JSON.stringify(obj);
  return encryptData(jsonString);
}

export function decryptObject<T>(encryptedData: string): T {
  const decrypted = decryptData(encryptedData);
  return JSON.parse(decrypted) as T;
}
