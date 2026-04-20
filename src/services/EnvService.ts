import path from 'path';
import { logger } from '../utils/index.js';
import { DiskRepository } from '../repositories/index.js';

export interface EnvValidationResult {
  missing: string[];
  found: string[];
  hasExample: boolean;
  hasEnv: boolean;
}

export class EnvService {
  constructor(private readonly diskRepo = new DiskRepository()) {}

  async validate(projectPath: string): Promise<EnvValidationResult> {
    const envPath = path.join(projectPath, '.env');
    const examplePath = path.join(projectPath, '.env.example');

    const result: EnvValidationResult = { missing: [], found: [], hasExample: false, hasEnv: false };

    try {
      if (!(await this.diskRepo.exists(examplePath))) {
        return result;
      }

      result.hasExample = true;
      result.hasEnv = await this.diskRepo.exists(envPath);
      
      const envContent = result.hasEnv ? await this.diskRepo.readFile(envPath) : '';
      const exampleContent = await this.diskRepo.readFile(examplePath);

      const envKeys = this.parseKeys(envContent);
      const exampleKeys = this.parseKeys(exampleContent);

      result.missing = exampleKeys.filter(key => !envKeys.includes(key));
      result.found = exampleKeys.filter(key => envKeys.includes(key));

      return result;
    } catch (error) {
      logger.error({ projectPath, error }, '.env dogrulamasi sirasinda hata');
      return result;
    }
  }

  /**
   * Eksik .env dosyasını .env.example'dan oluşturur veya eksik anahtarları ekler.
   */
  async fix(projectPath: string, missingKeys: string[]): Promise<boolean> {
    const envPath = path.join(projectPath, '.env');
    const examplePath = path.join(projectPath, '.env.example');

    try {
      if (!(await this.diskRepo.exists(envPath))) {
        await this.diskRepo.copy(examplePath, envPath);
        return true;
      }

      let envContent = await this.diskRepo.readFile(envPath);
      const exampleContent = await this.diskRepo.readFile(examplePath);
      const exampleLines = exampleContent.split('\n');

      for (const key of missingKeys) {
        const line = exampleLines.find(l => l.startsWith(`${key}=`));
        if (line) {
          envContent += `\n${line}`;
        }
      }

      await this.diskRepo.writeFile(envPath, envContent);
      return true;
    } catch (error) {
      logger.error({ projectPath, error }, '.env onarilirken hata olustu');
      return false;
    }
  }

  private parseKeys(content: string): string[] {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=')[0]?.trim())
      .filter((key): key is string => !!key);
  }
}
