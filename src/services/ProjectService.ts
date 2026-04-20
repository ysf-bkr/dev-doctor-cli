import { logger } from '../utils/index.js';
import { ToolName, CommandString } from '../types/index.js';
import { ShellRepository } from '../repositories/index.js';
import { t } from '../config/index.js';

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
        details: count > 0 ? t('proj_outdated_count', { count: count.toString() }) : t('proj_up_to_date'),
      };
    } catch (error: any) {
      if (error.status === 1 && error.stdout) {
        const outdated = JSON.parse(error.stdout.toString());
        const count = Object.keys(outdated).length;
        return {
          name: 'npm outdated' as ToolName,
          status: 'OUTDATED',
          details: t('proj_outdated_count', { count: count.toString() }),
        };
      }
      logger.debug({ error }, 'npm outdated kontrolu basarisiz');
      return { name: 'npm outdated', status: 'ERROR', details: t('proj_audit_fail') };
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
        details: total > 0 ? t('proj_vulnerabilities_count', { count: total.toString() }) : t('proj_no_vulnerabilities'),
      };
    } catch (error: any) {
      if (error.stdout) {
        try {
          const audit = JSON.parse(error.stdout.toString());
          const total = audit.metadata?.vulnerabilities?.total || 0;
          return {
            name: 'npm audit' as ToolName,
            status: total > 0 ? 'VULNERABLE' : 'OK',
            details: t('proj_vulnerabilities_count', { count: total.toString() }),
          };
        } catch { /* parse hatasi */ }
      }
      return { name: 'npm audit', status: 'ERROR', details: t('proj_audit_fail') };
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
      return t('proj_update_error');
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
      return t('proj_audit_fix_error');
    }
  }
}
