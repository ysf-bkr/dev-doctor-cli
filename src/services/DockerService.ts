import { execSync } from 'child_process';
import { logger } from '../utils/index.js';

export class DockerService {
  /**
   * Docker daemon'un çalışıp çalışmadığını kontrol eder.
   */
  async checkStatus(): Promise<{ isRunning: boolean; version?: string }> {
    try {
      const version = execSync('docker version --format "{{.Server.Version}}"', { encoding: 'utf8' }).trim();
      return { isRunning: true, version };
    } catch (error) {
      logger.debug({ error }, 'Docker daemon calismiyor');
      return { isRunning: false };
    }
  }

  /**
   * Kullanılmayan Docker kaynaklarını temizler.
   */
  async prune(): Promise<{ output: string }> {
    try {
      // images, containers, networks ve cache temizliği
      const output = execSync('docker system prune -af --volumes', { encoding: 'utf8' });
      return { output };
    } catch (error) {
      logger.error({ error }, 'Docker temizleme hatasi');
      return { output: 'Hata: Docker kaynakları temizlenemedi.' };
    }
  }

  /**
   * En büyük 5 Docker imajını listeler.
   */
  async getLargeImages(): Promise<Array<{ repository: string; tag: string; size: string }>> {
    try {
      const output = execSync('docker images --format "{{.Repository}}|{{.Tag}}|{{.Size}}"', { encoding: 'utf8' });
      const lines = output.trim().split('\n').filter(l => l.includes('|'));
      
      const images = lines.map(line => {
        const parts = line.split('|');
        return {
          repository: parts[0] || 'unknown',
          tag: parts[1] || 'latest',
          size: parts[2] || '0B'
        };
      });

      return images
        .sort((a, b) => this.parseSize(b.size) - this.parseSize(a.size))
        .slice(0, 5);
    } catch (error) {
      logger.error({ error }, 'Docker imajlari listelenemedi');
      return [];
    }
  }

  // Boyut dizisini (örn: 1.2GB) karşılaştırma için sayıya çevirir
  private parseSize(sizeStr: string): number {
    const num = parseFloat(sizeStr);
    if (sizeStr.includes('GB')) return num * 1024 * 1024 * 1024;
    if (sizeStr.includes('MB')) return num * 1024 * 1024;
    if (sizeStr.includes('KB')) return num * 1024;
    return num;
  }
}
