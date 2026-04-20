import path from 'path';
import os from 'os';
import { logger } from '../utils/index.js';
import { AbsolutePath, CommandString } from '../types/index.js';
import { DiskRepository, ShellRepository } from '../repositories/index.js';

export class DiskService {
  constructor(
    private readonly diskRepo = new DiskRepository(),
    private readonly shellRepo = new ShellRepository()
  ) {}

  /**
   * Uygulamanın root yetkisiyle çalışıp çalışmadığını kontrol eder.
   */
  isRoot(): boolean {
    try {
      if (os.platform() === 'win32') {
        return this.shellRepo.isInstalled('net session' as CommandString);
      }
      return process.getuid?.() === 0;
    } catch {
      return false;
    }
  }

  /**
   * Verilen yolun boyutunu paralel olarak hesaplar.
   */
  async calculateSize(targetPath: string): Promise<number> {
    try {
      const files = await this.diskRepo.findMatches(targetPath);
      const sizes = await Promise.all(
        files.map(file => this.getItemSize(file as AbsolutePath))
      );
      return sizes.reduce((acc, curr) => acc + curr, 0);
    } catch (error) {
      logger.error({ targetPath, error }, 'Dizin boyutu hesaplanırken hata oluştu');
      return 0;
    }
  }

  private async getItemSize(itemPath: AbsolutePath): Promise<number> {
    try {
      const stats = await this.diskRepo.stat(itemPath);
      if (stats.isDirectory()) {
        return await this.getDirSize(itemPath);
      }
      return stats.size;
    } catch (err) {
      logger.debug({ path: itemPath, err }, 'Öğe boyutu okunamadı');
      return 0;
    }
  }

  private async getDirSize(dirPath: AbsolutePath): Promise<number> {
    const files = await this.diskRepo.readdir(dirPath);
    const sizes = await Promise.all(
      files.map(file => {
        const fullPath = path.join(dirPath, file) as AbsolutePath;
        return this.getItemSize(fullPath);
      })
    );
    return sizes.reduce((acc, curr) => acc + curr, 0);
  }

  /**
   * Seçilen yolları güvenli bir şekilde temizler.
   * dryRun modu eklenmiştir.
   */
  async cleanPaths(paths: string[], options: { dryRun?: boolean } = {}) {
    let skippedSize = 0;
    let skippedCount = 0;
    let cleanedSize = 0;
    const currentWorkingDir = process.cwd();

    for (const pattern of paths) {
      try {
        const matches = await this.diskRepo.findMatches(pattern);
        
        const results = await Promise.all(
          matches.map(async (match) => {
            if (this.isProtected(match, currentWorkingDir)) {
              return { success: false, size: 0, protected: true };
            }

            if (options.dryRun) {
              const stats = await this.diskRepo.stat(match).catch(() => null);
              return { success: true, size: stats?.size || 0, dryRun: true };
            }

            return await this.removeItem(match as AbsolutePath);
          })
        );

        for (const res of results) {
          if (res.success) {
            cleanedSize += res.size;
          } else {
            skippedCount++;
            skippedSize += res.size;
          }
        }
      } catch (error) {
        logger.error({ pattern, error }, 'Desen temizlenirken hata oluştu');
      }
    }

    return { skippedSize, skippedCount, cleanedSize };
  }

  private isProtected(match: string, cwd: string): boolean {
    if (match.startsWith(cwd)) {
      logger.warn({ match }, 'Self-clean koruması tetiklendi, dizin atlandı');
      return true;
    }
    return false;
  }

  private async removeItem(itemPath: AbsolutePath): Promise<{ success: boolean; size: number }> {
    try {
      const stats = await this.diskRepo.stat(itemPath).catch(() => null);
      const size = stats?.size || 0;
      await this.diskRepo.remove(itemPath);
      return { success: true, size };
    } catch (err) {
      const stats = await this.diskRepo.stat(itemPath).catch(() => null);
      const isMac = os.platform() === 'darwin';
      const msg = isMac ? 'Erisim engellendi (Full Disk Access yetkisi gerekebilir)' : 'Dosya kullanimda veya erisim engellendi';
      logger.warn({ path: itemPath, err, msg }, 'Dosya silinemedi');
      return { success: false, size: stats?.size || 0 };
    }
  }

  /**
   * Belirtilen dizinde node_modules klasörlerini derinlemesine arar.
   */
  async scanStaleProjects(basePath: string): Promise<Array<{ path: string; size: number; lastModified: Date; projectName: string }>> {
    try {
      const pattern = path.join(basePath, '**/node_modules');
      const allMatches = await this.diskRepo.findMatches(pattern);
      
      // Filtreleme: İç içe geçmiş node_modules'ları ve gizli dizinleri ele
      const filteredMatches = allMatches.filter(match => {
        const parts = match.split(path.sep);
        const nodeModulesCount = parts.filter(p => p === 'node_modules').length;
        return nodeModulesCount === 1 && !parts.some(p => p.startsWith('.') && p !== '.');
      });

      const results = await Promise.all(
        filteredMatches.map(async (match) => {
          const projectPath = path.dirname(match);
          const stats = await this.diskRepo.stat(projectPath).catch(() => null);
          const size = await this.calculateSize(match);
          
          return {
            path: match,
            size,
            lastModified: stats?.mtime || new Date(),
            projectName: path.basename(projectPath)
          };
        })
      );

      return results.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    } catch (error) {
      logger.error({ basePath, error }, 'Derin tarama sirasinda hata olustu');
      return [];
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
