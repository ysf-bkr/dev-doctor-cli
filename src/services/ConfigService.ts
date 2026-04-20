import path from 'path';
import os from 'os';
import { z } from 'zod';
import { ConfigRepository, DiskRepository } from '../repositories/index.js';
import { logger } from '../utils/index.js';

export const ConfigSchema = z.object({
  locale: z.enum(['en', 'tr']).default('tr'),
  dryRun: z.boolean().default(false),
  customCleanPaths: z.array(z.string()).default([]),
  lastRun: z.string().optional()
});

export type Config = z.infer<typeof ConfigSchema>;

export class ConfigService {
  private config: Config = ConfigSchema.parse({});
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

  constructor(
    private readonly configRepo = new ConfigRepository(),
    private readonly diskRepo = new DiskRepository()
  ) {}

  async load(): Promise<Config> {
    try {
      const data = await this.configRepo.read();
      this.config = ConfigSchema.parse(data || {});
      return this.config;
    } catch (error) {
      logger.warn({ error }, 'Ayarlar yuklenirken hata olustu, varsayilanlar kullaniliyor');
      return this.config;
    }
  }

  async save(updates: Partial<Config>): Promise<void> {
    try {
      this.config = ConfigSchema.parse({ ...this.config, ...updates });
      await this.configRepo.write(this.config);
    } catch (error) {
      logger.error({ error }, 'Ayarlar kaydedilemedi');
    }
  }

  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  /**
   * Kritik ayar dosyalarını yedekler.
   */
  async backupConfigs(): Promise<{ backedUp: string[]; skipped: string[]; path: string }> {
    await this.diskRepo.ensureDir(this.backupDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sessionDir = path.join(this.backupDir, timestamp);
    await this.diskRepo.ensureDir(sessionDir);

    const backedUp: string[] = [];
    const skipped: string[] = [];

    for (const file of this.dotFiles) {
      const source = path.join(this.homeDir, file);
      if (await this.diskRepo.exists(source)) {
        await this.diskRepo.copy(source, path.join(sessionDir, file));
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
      const exists = await this.diskRepo.exists(filePath);
      let size = '0 B';

      if (exists) {
        const stats = await this.diskRepo.stat(filePath);
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
