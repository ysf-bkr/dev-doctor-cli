import { execSync } from 'child_process';
import { logger } from '../utils/index.js';
import { ToolName } from '../types/index.js';

export interface ProjectReport {
  name: string;
  status: 'OK' | 'OUTDATED' | 'VULNERABLE' | 'ERROR';
  details: string;
}

export class ProjectService {
  // Proje bagimliliklarinin guncelligini kontrol eder (npm outdated)
  // Eskimiş paketleri toplu olarak tespit etmek icin kullanilir
  async checkOutdated(): Promise<ProjectReport> {
    try {
      const output = execSync('npm outdated --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const outdated = JSON.parse(output || '{}');
      const count = Object.keys(outdated).length;

      return {
        name: 'npm outdated' as ToolName,
        status: count > 0 ? 'OUTDATED' : 'OK',
        details: count > 0 ? `${count} paket guncelleme bekliyor` : 'Tum paketler guncel',
      };
    } catch (error: any) {
      // npm outdated hata kodu 1 donerse paketler eskidir (hata degil durumdur)
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

  // Guvenlik acigi olan paketleri tarar (npm audit)
  // Kritik aciklari erken tespit ederek guvenligi artirmak amaclanir
  async checkVulnerabilities(): Promise<ProjectReport> {
    try {
      const output = execSync('npm audit --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const audit = JSON.parse(output || '{}');
      const total = audit.metadata?.vulnerabilities?.total || 0;

      return {
        name: 'npm audit' as ToolName,
        status: total > 0 ? 'VULNERABLE' : 'OK',
        details: total > 0 ? `${total} adet guvenlik acigi tespit edildi` : 'Guvenlik acigi bulunmadi',
      };
    } catch (error: any) {
      // npm audit hata kodu donerse acik var demektir
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
}
