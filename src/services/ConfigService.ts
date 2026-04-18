import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { logger } from '../utils/index.js';

export class ConfigService {
  private readonly homeDir = os.homedir();
  private readonly backupDir = path.join(os.homedir(), '.dev-doctor-backups');

  private readonly dotFiles = [
    '.zshrc',
    '.bashrc',
    '.gitconfig',
    '.vimrc',
    '.npmrc',
    '.pnpm-shell-completion'
  ];

  /**
   * Kritik ayar dosyalarını yedekler.
   */
  async backupConfigs(): Promise<{ backedUp: string[]; skipped: string[]; path: string }> {
    await fs.ensureDir(this.backupDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sessionDir = path.join(this.backupDir, timestamp);
    await fs.ensureDir(sessionDir);

    const backedUp: string[] = [];
    const skipped: string[] = [];

    for (const file of this.dotFiles) {
      const source = path.join(this.homeDir, file);
      if (await fs.pathExists(source)) {
        await fs.copy(source, path.join(sessionDir, file));
        backedUp.push(file);
      } else {
        skipped.push(file);
      }
    }

    return { backedUp, skipped, path: sessionDir };
  }

  /**
   * Mevcut ayar dosyalarının listesini ve boyutlarını döndürür.
   */
  async listConfigs(): Promise<Array<{ name: string; size: string; exists: boolean }>> {
    const results = [];
    for (const file of this.dotFiles) {
      const filePath = path.join(this.homeDir, file);
      const exists = await fs.pathExists(filePath);
      let size = '0 B';

      if (exists) {
        const stats = await fs.stat(filePath);
        size = this.formatSize(stats.size);
      }

      results.push({ name: file, size, exists });
    }
    return results;
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
