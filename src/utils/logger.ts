import pino from 'pino';
import path from 'path';

// Log dosyasi konumu: Mevcut calisma dizininde dev-doctor.log
const logFilePath = path.join(process.cwd(), 'dev-doctor.log');

/**
 * Standardize edilmis Logger.
 * Terminal kirliligini onlemek icin loglar dosyaya yazilir.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err
  },
  base: {
    pid: process.pid,
    hostname: 'local'
  }
}, pino.destination(logFilePath));
