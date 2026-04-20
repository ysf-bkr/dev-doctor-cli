import os from 'os';
import { logger } from '../utils/index.js';
import { ShellRepository } from '../repositories/index.js';
import { CommandString } from '../types/index.js';

export interface GhostProcess {
  pid: string;
  name: string;
  cpu: string;
  mem: string;
  cmd: string;
}

export class ProcessService {
  constructor(private readonly shellRepo = new ShellRepository()) {}

  /**
   * Hayalet süreçleri tespit eder.
   */
  async findGhostProcesses(): Promise<GhostProcess[]> {
    try {
      const platform = os.platform();
      let cmd = '';

      if (platform === 'darwin' || platform === 'linux') {
        // CPU veya Bellek tüketen Node süreçlerini bul
        cmd = 'ps aux | grep -E "node|python|git|docker" | grep -v "grep"';
      } else {
        cmd = 'wmic process get name,processid,executablepath';
      }

      const output = this.shellRepo.execute(cmd as CommandString);
      return this.parseProcesses(output, platform);
    } catch (error) {
      logger.error({ error }, 'Hayalet surec tarama hatasi');
      return [];
    }
  }

  private parseProcesses(output: string, platform: string): GhostProcess[] {
    const lines = output.trim().split('\n');
    const ghosts: GhostProcess[] = [];

    lines.forEach(line => {
      const parts = line.split(/\s+/).filter(Boolean);
      
      if (platform === 'darwin' || platform === 'linux') {
        const pid = parts[1] || '0';
        const cpu = parts[2] || '0';
        const mem = parts[3] || '0';
        const name = parts[10] || 'Unknown';
        const fullCmd = parts.slice(10).join(' ');

        // Filtre: Çok düşük kaynak tüketenleri ve sistem süreçlerini ele
        if (parseFloat(cpu) > 0.5 || parseFloat(mem) > 1.0) {
          ghosts.push({ pid, name, cpu, mem, cmd: fullCmd });
        }
      } else {
        // Windows parsing logic
        const pid = parts[parts.length - 1];
        const name = parts[0];
        if (pid && name) {
          ghosts.push({ pid, name, cpu: 'N/A', mem: 'N/A', cmd: line });
        }
      }
    });

    return ghosts;
  }
}
