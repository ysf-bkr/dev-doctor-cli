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
        // Windows'ta yetki kontrolü için alternatif bir komut
        try {
          this.shellRepo.execute('fltmc' as CommandString);
          return true;
        } catch {
          return false;
        }
      }
      return process.getuid?.() === 0;
    } catch {
      return false;
    }
  }

  /**
   * macOS ve Linux için hızlı boyut hesaplama (du komutu kullanılır)
   */
  private async getFastSize(targetPath: string): Promise<number | null> {
    if (os.platform() === 'win32') return null;
    
    try {
      const output = await this.shellRepo.execute(`du -sk "${targetPath}"` as CommandString);
      const match = output.split('\t')[0];
      if (match) {
        return parseInt(match, 10) * 1024; // KB to Bytes
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Verilen yolun boyutunu hesaplar. Önce hızlı yöntemi dener.
   */
  async calculateSize(targetPath: string): Promise<number> {
    try {
      const fastSize = await this.getFastSize(targetPath);
      if (fastSize !== null) return fastSize;

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
    const skippedReasons: string[] = [];
    const currentWorkingDir = process.cwd();

    for (const pattern of paths) {
      try {
        const matches = await this.diskRepo.findMatches(pattern);
        
        const results = await Promise.all(
          matches.map(async (match) => {
            if (this.isProtected(match, currentWorkingDir)) {
              return { success: false, size: 0, protected: true, reason: 'Kritik dizin koruması (Self-clean protection)' };
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
            if (res.reason) skippedReasons.push(res.reason);
          }
        }
      } catch (error) {
        logger.error({ pattern, error }, 'Desen temizlenirken hata oluştu');
      }
    }

    return { skippedSize, skippedCount, cleanedSize, skippedReasons };
  }

  private isProtected(match: string, cwd: string): boolean {
    // Sadece uygulamanın çalıştığı klasörü ve kritik sistem dizinlerini koru
    const protectedPaths = [
      cwd,
      path.join(os.homedir(), '.ssh'),
      path.join(os.homedir(), '.gnupg'),
    ];

    // Eğer çalışma dizini monorepo kökü veya apps/cli ise koru
    if (match === cwd || (cwd.endsWith('dev-doctor') && match.startsWith(cwd))) {
      logger.warn({ match }, 'Kritik dizin koruması tetiklendi, atlanıyor');
      return true;
    }

    return protectedPaths.some(p => match === p);
  }

  private async removeItem(itemPath: AbsolutePath): Promise<{ success: boolean; size: number; reason?: string }> {
    try {
      const stats = await this.diskRepo.stat(itemPath).catch(() => null);
      const size = stats?.size || 0;
      await this.diskRepo.remove(itemPath);
      return { success: true, size };
    } catch (err: any) {
      const stats = await this.diskRepo.stat(itemPath).catch(() => null);
      const isMac = os.platform() === 'darwin';
      
      let reason = 'Bilinmeyen hata';
      if (err.code === 'EACCES' || err.code === 'EPERM') {
        reason = isMac 
          ? 'Erişim Engellendi (Full Disk Access yetkisi gerekebilir. Sistem Ayarları > Gizlilik > Tam Disk Erişimi yolundan terminale izin verin.)' 
          : 'Erişim Engellendi (Dosya başka bir program tarafından kullanılıyor veya yönetici yetkisi gerekiyor.)';
      } else if (err.code === 'EBUSY') {
        reason = 'Dosya meşgul (Şu an başka bir uygulama tarafından kullanıldığı için silinemedi.)';
      } else if (err.code === 'ENOENT') {
        reason = 'Dosya bulunamadı (Tarama sonrası silinmiş veya taşınmış olabilir.)';
      }

      logger.warn({ path: itemPath, err, reason }, 'Dosya silinemedi');
      return { success: false, size: stats?.size || 0, reason };
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
