import { storage } from "../storage";
import { encryptObject } from "./encryption";
import { writeFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";

const BACKUP_DIR = join(process.cwd(), "backups");
const MAX_BACKUPS = 10;

if (!existsSync(BACKUP_DIR)) {
  mkdirSync(BACKUP_DIR, { recursive: true });
}

export async function createBackup(): Promise<string> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `backup-${timestamp}.json`;
    const filepath = join(BACKUP_DIR, filename);

    const users = await storage.getAllUsers();
    
    const backupData = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      data: {
        users: users.map(user => ({
          ...user,
          password: "[ENCRYPTED]"
        })),
      },
    };

    const encryptedBackup = encryptObject(backupData);
    
    writeFileSync(filepath, JSON.stringify({
      encrypted: true,
      data: encryptedBackup,
    }, null, 2));

    console.log(`[BACKUP] Backup created successfully: ${filename}`);
    
    cleanOldBackups();

    return filename;
  } catch (error) {
    console.error("[BACKUP] Failed to create backup:", error);
    throw error;
  }
}

function cleanOldBackups(): void {
  try {
    const files = readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith("backup-") && file.endsWith(".json"))
      .map(file => ({
        name: file,
        path: join(BACKUP_DIR, file),
        time: statSync(join(BACKUP_DIR, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > MAX_BACKUPS) {
      const filesToDelete = files.slice(MAX_BACKUPS);
      filesToDelete.forEach(file => {
        unlinkSync(file.path);
        console.log(`[BACKUP] Deleted old backup: ${file.name}`);
      });
    }
  } catch (error) {
    console.error("[BACKUP] Failed to clean old backups:", error);
  }
}

export function scheduleAutomaticBackups(): void {
  const BACKUP_INTERVAL = 1000 * 60 * 60 * 24;
  
  createBackup().catch(console.error);

  setInterval(() => {
    createBackup().catch(console.error);
  }, BACKUP_INTERVAL);

  console.log("[BACKUP] Automatic backups scheduled (every 24 hours)");
}
