import path from 'path';
import { pathToFileURL } from 'url';
import { logger } from '../utils/index.js';
import { DiskRepository } from '../repositories/index.js';

export interface DoctorPlugin {
  name: string;
  author?: string;
  doctors?: Array<{
    name: string;
    check: () => Promise<{ status: 'OK' | 'WARN' | 'ERROR'; details: string }>;
  }>;
  cleaners?: Array<{
    name: string;
    paths: string[];
  }>;
}

export class PluginService {
  constructor(private readonly diskRepo = new DiskRepository()) {}

  /**
   * dev-doctor.config.js dosyasını yükler.
   */
  async loadPlugins(): Promise<DoctorPlugin | null> {
    const configPath = path.join(process.cwd(), 'dev-doctor.config.js');
    
    try {
      if (!(await this.diskRepo.exists(configPath))) {
        return null;
      }

      // ESM import için file URL gerekiyor
      const fileUrl = pathToFileURL(configPath).href;
      const module = await import(fileUrl);
      
      return module.default || module;
    } catch (error) {
      logger.error({ configPath, error }, 'Plugin yukleme hatasi');
      return null;
    }
  }
}
