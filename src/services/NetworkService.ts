import os from 'os';
import { logger } from '../utils/index.js';
import { ShellRepository } from '../repositories/index.js';
import { CommandString } from '../types/index.js';

export interface PortInfo {
  port: string;
  pid: string;
  process: string;
}

export class NetworkService {
  constructor(private readonly shellRepo = new ShellRepository()) {}

  /**
   * Aktif dinlenen portları ve bunları kullanan süreçleri listeler.
   */
  async getActivePorts(): Promise<PortInfo[]> {
    try {
      const platform = os.platform();
      let cmd = '';
      
      if (platform === 'darwin' || platform === 'linux') {
        cmd = 'lsof -i -P -n | grep LISTEN';
      } else {
        cmd = 'netstat -ano | findstr LISTENING';
      }

      const output = this.shellRepo.execute(cmd as CommandString);
      return this.parsePorts(output, platform);
    } catch (error) {
      logger.debug({ error }, 'Portlar listelenemedi');
      return [];
    }
  }

  /**
   * Belirli bir PID'ye sahip süreci sonlandırır.
   */
  async killProcess(pid: string): Promise<boolean> {
    try {
      const cmd = os.platform() === 'win32' ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
      this.shellRepo.execute(cmd as CommandString);
      return true;
    } catch (error) {
      logger.error({ pid, error }, 'Surec sonlandirilamadi');
      return false;
    }
  }

  /**
   * NPM registry hızını test eder (ms cinsinden).
   */
  async pingNpm(): Promise<number> {
    const start = Date.now();
    try {
      await fetch('https://registry.npmjs.org', { method: 'HEAD' });
      return Date.now() - start;
    } catch {
      return 9999;
    }
  }

  /**
   * NPM registry adresini değiştirir.
   */
  async setNpmRegistry(url: string): Promise<boolean> {
    try {
      this.shellRepo.execute(`npm config set registry ${url}` as CommandString);
      return true;
    } catch (error) {
      logger.error({ url, error }, 'NPM registry degistirilemedi');
      return false;
    }
  }

  private parsePorts(output: string, platform: string): PortInfo[] {
    const lines = output.trim().split('\n');
    const results: PortInfo[] = [];

    lines.forEach(line => {
      const parts = line.split(/\s+/).filter(Boolean);
      if (platform === 'darwin' || platform === 'linux') {
        const namePart = parts[8] || '';
        const portMatch = namePart.match(/:(\d+)$/);
        
        if (portMatch && parts[0] && parts[1]) {
          results.push({
            process: parts[0],
            pid: parts[1],
            port: portMatch[1] as string
          });
        }
      } else {
        const addrPart = parts[1] || '';
        const portMatch = addrPart.match(/:(\d+)$/);
        const pidPart = parts[4];
        
        if (portMatch && pidPart) {
          results.push({
            process: 'Unknown',
            pid: pidPart,
            port: portMatch[1] as string
          });
        }
      }
    });

    return results;
  }
}
