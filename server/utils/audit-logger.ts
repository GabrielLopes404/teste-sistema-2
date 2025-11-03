import { randomUUID } from "crypto";
import { hashSensitiveData } from "./encryption";

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string | null;
  username: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: "success" | "failure";
  details: Record<string, any>;
  hash: string;
}

const auditLogs: AuditLog[] = [];
let previousHash = "0";

export function createAuditLog(params: {
  userId?: string | null;
  username?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  status: "success" | "failure";
  details?: Record<string, any>;
}): AuditLog {
  const log: AuditLog = {
    id: randomUUID(),
    timestamp: new Date(),
    userId: params.userId || null,
    username: params.username || null,
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId || null,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent || null,
    status: params.status,
    details: params.details || {},
    hash: "",
  };

  const logData = `${log.id}|${log.timestamp.toISOString()}|${log.userId}|${log.action}|${log.resource}|${log.status}|${previousHash}`;
  log.hash = hashSensitiveData(logData);
  
  previousHash = log.hash;

  auditLogs.push(log);

  console.log(`[AUDIT] ${log.action} on ${log.resource} by ${log.username || "anonymous"} - ${log.status}`);

  return log;
}

export function getAuditLogs(filters?: {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): AuditLog[] {
  let filtered = [...auditLogs];

  if (filters?.userId) {
    filtered = filtered.filter((log) => log.userId === filters.userId);
  }
  if (filters?.action) {
    filtered = filtered.filter((log) => log.action === filters.action);
  }
  if (filters?.resource) {
    filtered = filtered.filter((log) => log.resource === filters.resource);
  }
  if (filters?.startDate) {
    filtered = filtered.filter((log) => log.timestamp >= filters.startDate!);
  }
  if (filters?.endDate) {
    filtered = filtered.filter((log) => log.timestamp <= filters.endDate!);
  }

  filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
}

export function verifyAuditLogIntegrity(log: AuditLog, previousLog: AuditLog | null): boolean {
  const prevHash = previousLog ? previousLog.hash : "0";
  const logData = `${log.id}|${log.timestamp.toISOString()}|${log.userId}|${log.action}|${log.resource}|${log.status}|${prevHash}`;
  const calculatedHash = hashSensitiveData(logData);
  
  return calculatedHash === log.hash;
}

export function logFinancialOperation(params: {
  userId: string;
  username: string;
  operation: string;
  amount: number;
  resource: string;
  resourceId: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}): void {
  createAuditLog({
    userId: params.userId,
    username: params.username,
    action: `FINANCIAL_${params.operation.toUpperCase()}`,
    resource: params.resource,
    resourceId: params.resourceId,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    status: "success",
    details: {
      ...params.details,
      amount: params.amount,
      currency: "BRL",
      timestamp: new Date().toISOString(),
    },
  });
}
