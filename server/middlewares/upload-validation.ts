import { Request, Response, NextFunction } from "express";
import { securityConfig } from "../config/security";
import { createAuditLog } from "../utils/audit-logger";

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const files = (req as any).files || (req as any).file ? [(req as any).file] : [];

  if (files.length === 0) {
    return next();
  }

  for (const file of files as UploadedFile[]) {
    if (!securityConfig.upload.allowedMimeTypes.includes(file.mimetype)) {
      createAuditLog({
        userId: (req as any).user?.id,
        username: (req as any).user?.username,
        action: "UPLOAD_INVALID_FILE_TYPE",
        resource: "upload",
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        status: "failure",
        details: {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        },
      });

      return res.status(400).json({
        message: `Tipo de arquivo não permitido: ${file.mimetype}. Tipos permitidos: imagens, PDF, Excel, CSV`,
      });
    }

    if (file.size > securityConfig.upload.maxFileSize) {
      createAuditLog({
        userId: (req as any).user?.id,
        username: (req as any).user?.username,
        action: "UPLOAD_FILE_TOO_LARGE",
        resource: "upload",
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        status: "failure",
        details: {
          filename: file.originalname,
          size: file.size,
          maxSize: securityConfig.upload.maxFileSize,
        },
      });

      return res.status(400).json({
        message: `Arquivo muito grande. Tamanho máximo: ${securityConfig.upload.maxFileSize / 1024 / 1024}MB`,
      });
    }

    const dangerousExtensions = [
      ".exe",
      ".bat",
      ".cmd",
      ".sh",
      ".ps1",
      ".vbs",
      ".js",
      ".jar",
      ".com",
      ".scr",
    ];

    const fileExt = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf("."));
    
    if (dangerousExtensions.includes(fileExt)) {
      createAuditLog({
        userId: (req as any).user?.id,
        username: (req as any).user?.username,
        action: "UPLOAD_DANGEROUS_EXTENSION",
        resource: "upload",
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        status: "failure",
        details: {
          filename: file.originalname,
          extension: fileExt,
        },
      });

      return res.status(400).json({
        message: `Extensão de arquivo perigosa não permitida: ${fileExt}`,
      });
    }
  }

  createAuditLog({
    userId: (req as any).user?.id,
    username: (req as any).user?.username,
    action: "UPLOAD_FILE_VALIDATED",
    resource: "upload",
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    status: "success",
    details: {
      fileCount: files.length,
      files: files.map((f: UploadedFile) => ({
        name: f.originalname,
        size: f.size,
        type: f.mimetype,
      })),
    },
  });

  next();
};

export const preventPathTraversal = (filename: string): string => {
  return filename
    .replace(/\.\./g, "")
    .replace(/\\/g, "")
    .replace(/\//g, "")
    .replace(/[<>:"|?*]/g, "")
    .trim();
};
