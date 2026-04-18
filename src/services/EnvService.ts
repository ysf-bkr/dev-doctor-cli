import fs from 'fs-extra';
import path from 'path';
import { logger } from '../utils/index.js';

export interface EnvValidationResult {
  missing: string[];
  found: string[];
  hasExample: boolean;
}

export class EnvService {
  // .env dosyasini .env.example ile karsilastirarak eksik degiskenleri bulur
  // Projenin farkli ortamlarda eksiksiz calisabilmesi icin onemlidir
  async validate(projectPath: string): Promise<EnvValidationResult> {
    const envPath = path.join(projectPath, '.env');
    const examplePath = path.join(projectPath, '.env.example');

    const result: EnvValidationResult = { missing: [], found: [], hasExample: false };

    try {
      if (!(await fs.pathExists(examplePath))) {
        return result;
      }

      result.hasExample = true;
      const envContent = await fs.pathExists(envPath) ? await fs.readFile(envPath, 'utf8') : '';
      const exampleContent = await fs.readFile(examplePath, 'utf8');

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

  // .env icindeki gizli bilgilerin (secret) commit edilip edilmedigini kabaca kontrol eder
  // Guvenlik ihlallerini onlemek amaciyla kullanilir
  detectSecrets(content: string): string[] {
    const secretRegex = /(key|secret|token|password|auth|private) *= *['"]?([^'"\n ]+)['"]?/gi;
    const matches = [];
    let match;
    
    while ((match = secretRegex.exec(content)) !== null) {
      if (match[2] && match[2].length > 10) { // Cok kisa degerleri atla
        matches.push(match[1] as string);
      }
    }

    return matches;
  }

  // .env dosyasindaki degisken isimlerini ayristirir
  private parseKeys(content: string): string[] {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=')[0]?.trim())
      .filter((key): key is string => !!key);
  }
}
