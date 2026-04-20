import { logger } from '../utils/index.js';
import { DiskRepository } from '../repositories/index.js';
import { AbsolutePath } from '../types/index.js';

export interface SecurityLeak {
  file: string;
  type: string;
  line: number;
}

export class SecurityService {
  private readonly rules = [
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
    { name: 'AWS Secret Key', regex: /([0-9a-zA-Z/+]{40})/g }, // Genelde AWS_SECRET_ACCESS_KEY bağlamında aranmalı
    { name: 'Stripe API Key', regex: /sk_live_[0-9a-zA-Z]{24}/g },
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z\\-_]{35}/g },
    { name: 'Private Key', regex: /-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----/g },
    { name: 'GitHub Token', regex: /ghp_[a-zA-Z0-9]{36}/g },
  ];

  constructor(private readonly diskRepo = new DiskRepository()) {}

  /**
   * Belirtilen dizindeki dosyaları sızıntılara karşı tarar.
   */
  async scanForLeaks(basePath: string): Promise<SecurityLeak[]> {
    const leaks: SecurityLeak[] = [];
    try {
      // Sadece kod ve ayar dosyalarını tara
      const pattern = `${basePath}/**/*.{js,ts,py,env,json,yml,yaml,xml,txt,sh}`;
      const files = await this.diskRepo.findMatches(pattern);
      
      // node_modules ve dist gibi klasörleri ele
      const filteredFiles = files.filter(f => !f.includes('node_modules') && !f.includes('dist') && !f.includes('.git/'));

      for (const file of filteredFiles) {
        const content = await this.diskRepo.readFile(file as AbsolutePath);
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          for (const rule of this.rules) {
            if (rule.regex.test(line)) {
              leaks.push({
                file: file,
                type: rule.name,
                line: index + 1
              });
              rule.regex.lastIndex = 0; // Reset regex
            }
          }
        });
      }

      return leaks;
    } catch (error) {
      logger.error({ basePath, error }, 'Guvenlik tarama hatasi');
      return leaks;
    }
  }
}
