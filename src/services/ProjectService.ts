import { logger } from '../utils/index.js';
import { ToolName, CommandString } from '../types/index.js';
import { ShellRepository } from '../repositories/index.js';

export interface ProjectReport {
  name: string;
  status: 'OK' | 'OUTDATED' | 'VULNERABLE' | 'ERROR';
  details: string;
}

export class ProjectService {
  constructor(private readonly shellRepo = new ShellRepository()) {}

  /**
   * Proje bagimliliklarinin guncelligini kontrol eder.
   */
  async checkOutdated(): Promise<ProjectReport> {
    try {
      const output = this.shellRepo.execute('npm outdated --json' as CommandString);
      const outdated = JSON.parse(output || '{}');
      const count = Object.keys(outdated).length;

      return {
        name: 'npm outdated' as ToolName,
        status: count > 0 ? 'OUTDATED' : 'OK',
        details: count > 0 ? `${count} paket guncelleme bekliyor` : 'Tum paketler guncel',
      };
    } catch (error: any) {
      if (error.status === 1 && error.stdout) {
        const outdated = JSON.parse(error.stdout.toString());
        const count = Object.keys(outdated).length;
        return {
          name: 'npm outdated' as ToolName,
          status: 'OUTDATED',
          details: `${count} paket guncelleme bekliyor`,
        };
      }
      logger.debug({ error }, 'npm outdated kontrolu basarisiz');
      return { name: 'npm outdated', status: 'ERROR', details: 'Kontrol yapilamadi' };
    }
  }

  /**
   * Guvenlik acigi olan paketleri tarar.
   */
  async checkVulnerabilities(): Promise<ProjectReport> {
    try {
      const output = this.shellRepo.execute('npm audit --json' as CommandString);
      const audit = JSON.parse(output || '{}');
      const total = audit.metadata?.vulnerabilities?.total || 0;

      return {
        name: 'npm audit' as ToolName,
        status: total > 0 ? 'VULNERABLE' : 'OK',
        details: total > 0 ? `${total} adet guvenlik acigi tespit edildi` : 'Guvenlik acigi bulunmadi',
      };
    } catch (error: any) {
      if (error.stdout) {
        try {
          const audit = JSON.parse(error.stdout.toString());
          const total = audit.metadata?.vulnerabilities?.total || 0;
          return {
            name: 'npm audit' as ToolName,
            status: total > 0 ? 'VULNERABLE' : 'OK',
            details: `${total} adet guvenlik acigi tespit edildi`,
          };
        } catch { /* parse hatasi */ }
      }
      return { name: 'npm audit', status: 'ERROR', details: 'Audit calistirilamadi' };
    }
  }

  /**
   * Bagimliliklari gunceller.
   */
  async fixOutdated(): Promise<string> {
    try {
      return this.shellRepo.execute('npm update' as CommandString);
    } catch (error: any) {
      logger.error({ error }, 'npm update hatasi');
      return 'Hata: Paketler guncellenemedi.';
    }
  }

  /**
   * Guvenlik aciklarini onarir.
   */
  async fixVulnerabilities(): Promise<string> {
    try {
      return this.shellRepo.execute('npm audit fix' as CommandString);
    } catch (error: any) {
      logger.error({ error }, 'npm audit fix hatasi');
      return 'Hata: Guvenlik aciklari onarilamadi.';
    }
  }
}
