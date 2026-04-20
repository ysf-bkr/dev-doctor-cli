import path from 'path';
import os from 'os';
import { logger } from '../utils/index.js';
import { DiskRepository } from '../repositories/index.js';

export class BrowserService {
  constructor(private readonly diskRepo = new DiskRepository()) {}

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
    } else if (platform === 'linux') {
      paths.push(
        path.join(home, '.cache/google-chrome'),
        path.join(home, '.mozilla/firefox/*.default-release/cache2')
      );
    }

    const cleaned: string[] = [];
    const failed: string[] = [];

    for (const p of paths) {
      try {
        if (await this.diskRepo.exists(p)) {
          // Önbellek dizini içini boşalt
          const files = await this.diskRepo.readdir(p);
          for (const file of files) {
            await this.diskRepo.remove(path.join(p, file));
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
