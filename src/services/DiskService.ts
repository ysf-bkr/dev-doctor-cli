import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import os from 'os';
import { execSync } from 'child_process';
import { logger } from '../utils/index.js';
import { AbsolutePath } from '../types/index.js';

export class DiskService {
  /**
   * Uygulamanın root yetkisiyle çalışıp çalışmadığını kontrol eder.
   * Bazı sistem klasörlerine erişim için bu bilgi kritik öneme sahiptir.
   */
  isRoot(): boolean {
    try {
      if (os.platform() === 'win32') {
        execSync('net session', { stdio: 'ignore' });
        return true;
      }
      return process.getuid?.() === 0;
    } catch {
      return false;
    }
  }

  /**
   * Verilen yolun boyutunu rekürsif olarak hesaplar.
   * Kullanıcıya ne kadar alan kazanacağını göstermek için gereklidir.
   */
  async calculateSize(targetPath: string): Promise<number> {
    try {
      const files = await glob(targetPath, { nodir: false, absolute: true });
      let total = 0;

      for (const file of files) {
        total += await this.getItemSize(file as AbsolutePath);
      }

      return total;
    } catch (error) {
      logger.error({ targetPath, error }, 'Dizin boyutu hesaplanırken hata oluştu');
      return 0;
    }
  }

  /**
   * Tek bir dosya veya dizinin boyutunu güvenli şekilde döner.
   */
  private async getItemSize(itemPath: AbsolutePath): Promise<number> {
    try {
      const stats = await fs.stat(itemPath);
      if (stats.isDirectory()) {
        return await this.getDirSize(itemPath);
      }
      return stats.size;
    } catch (err) {
      logger.debug({ path: itemPath, err }, 'Öğe boyutu okunamadı');
      return 0;
    }
  }

  /**
   * Bir dizinin toplam boyutunu rekürsif olarak hesaplar.
   */
  private async getDirSize(dirPath: AbsolutePath): Promise<number> {
    const files = await fs.readdir(dirPath);
    let size = 0;

    for (const file of files) {
      const fullPath = path.join(dirPath, file) as AbsolutePath;
      size += await this.getItemSize(fullPath);
    }
    
    return size;
  }

  /**
   * Seçilen yolları güvenli bir şekilde temizler.
   * Uygulamanın kendi çalışma dizinini silmesini engelleyen bir güvenlik kilidi içerir.
   */
  async cleanPaths(paths: string[]) {
    let skippedSize = 0;
    let skippedCount = 0;
    const currentWorkingDir = process.cwd();

    for (const pattern of paths) {
      try {
        const matches = await glob(pattern, { absolute: true });
        
        for (const match of matches) {
          if (this.isProtected(match, currentWorkingDir)) {
            skippedCount++;
            continue;
          }

          const result = await this.removeItem(match as AbsolutePath);
          if (!result.success) {
            skippedSize += result.size;
            skippedCount++;
          }
        }
      } catch (error) {
        logger.error({ pattern, error }, 'Desen temizlenirken hata oluştu');
      }
    }

    return { skippedSize, skippedCount };
  }

  /**
   * Yolun korumalı olup olmadığını kontrol eder (Self-clean koruması).
   */
  private isProtected(match: string, cwd: string): boolean {
    if (match.startsWith(cwd)) {
      logger.warn({ match }, 'Self-clean koruması tetiklendi, dizin atlandı');
      return true;
    }
    return false;
  }

  /**
   * Dosya sisteminden bir öğeyi siler ve sonucunu döner.
   */
  private async removeItem(itemPath: AbsolutePath): Promise<{ success: boolean; size: number }> {
    try {
      const stats = await fs.stat(itemPath).catch(() => null);
      const size = stats?.size || 0;
      await fs.remove(itemPath);
      return { success: true, size };
    } catch (err) {
      const stats = await fs.stat(itemPath).catch(() => null);
      const isMac = os.platform() === 'darwin';
      const msg = isMac ? 'Erisim engellendi (Full Disk Access yetkisi gerekebilir)' : 'Dosya kullanimda veya erisim engellendi';
      logger.warn({ path: itemPath, err, msg }, 'Dosya silinemedi');
      return { success: false, size: stats?.size || 0 };
    }
  }

  /**
   * Bayt cinsinden boyutu okunabilir formata çevirir (B, KB, MB, GB, TB).
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
