import { execSync } from 'child_process';
import os from 'os';
import { logger } from '../utils/index.js';

export interface PortInfo {
  port: string;
  pid: string;
  process: string;
}

export class NetworkService {
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

      const output = execSync(cmd, { encoding: 'utf8' });
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
      execSync(cmd, { stdio: 'ignore' });
      return true;
    } catch (error) {
      logger.error({ pid, error }, 'Surec sonlandirilamadi');
      return false;
    }
  }

  private parsePorts(output: string, platform: string): PortInfo[] {
    const lines = output.trim().split('\n');
    const results: PortInfo[] = [];

    lines.forEach(line => {
      const parts = line.split(/\s+/).filter(Boolean);
      if (platform === 'darwin' || platform === 'linux') {
        // COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
        // index 8 Genellikle *:port veya 127.0.0.1:port şeklindedir
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
        // TCP 0.0.0.0:135 0.0.0.0:0 LISTENING 992
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
