import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { logger } from '../utils/index.js';

export class BrowserService {
  /**
   * Tarayıcı önbellek dizinlerini temizler.
   */
  async cleanCaches(): Promise<{ cleaned: string[]; failed: string[] }> {
    const platform = os.platform();
    const home = os.homedir();
    const paths: string[] = [];

    if (platform === 'darwin') {
      paths.push(
        path.join(home, 'Library/Caches/Google/Chrome'),
        path.join(home, 'Library/Caches/com.apple.Safari'),
        path.join(home, 'Library/Application Support/Firefox/Profiles')
      );
    } else if (platform === 'win32') {
      const localApp = process.env.LOCALAPPDATA || '';
      paths.push(
        path.join(localApp, 'Google/Chrome/User Data/Default/Cache'),
        path.join(localApp, 'Microsoft/Edge/User Data/Default/Cache')
      );
    }

    const cleaned: string[] = [];
    const failed: string[] = [];

    for (const p of paths) {
      try {
        if (await fs.pathExists(p)) {
          // Önbellek dizini içini boşalt
          const files = await fs.readdir(p);
          for (const file of files) {
            await fs.remove(path.join(p, file));
          }
          cleaned.push(p);
        }
      } catch (error) {
        logger.warn({ path: p, error }, 'Tarayici onbellegi temizlenemedi');
        failed.push(p);
      }
    }

    return { cleaned, failed };
  }
}
