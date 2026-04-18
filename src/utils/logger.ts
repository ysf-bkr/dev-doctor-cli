import pino from 'pino';
import path from 'path';

// Log dosyasi konumu: Mevcut calisma dizininde dev-doctor.log
const logFilePath = path.join(process.cwd(), 'dev-doctor.log');

/**
 * Standardize edilmis Logger.
 * Terminal kirliligini onlemek icin loglar dosyaya yazilir.
 * Sadece kritik hatalar (fatal) hem dosyaya hem terminale duser.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
}, pino.destination(logFilePath));
