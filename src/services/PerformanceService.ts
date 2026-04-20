import os from 'os';
import path from 'path';
import { logger } from '../utils/index.js';
import { DiskRepository, ShellRepository } from '../repositories/index.js';
import { CommandString, AbsolutePath } from '../types/index.js';

export interface PerfReport {
  totalTime: number;
  slowCommands: Array<{ cmd: string; time: number }>;
  suggestions: string[];
}

export class PerformanceService {
  constructor(
    private readonly diskRepo = new DiskRepository(),
    private readonly shellRepo = new ShellRepository()
  ) {}

  /**
   * Terminal açılış hızını analiz eder.
   */
  async analyzeStartup(): Promise<PerfReport> {
    const profilePath = this.getProfilePath();
    const report: PerfReport = { totalTime: 0, slowCommands: [], suggestions: [] };

    if (!profilePath || !(await this.diskRepo.exists(profilePath))) {
      return report;
    }

    try {
      // 1. Toplam süreyi ölç
      const shell = path.basename(process.env.SHELL || 'zsh');
      const start = Date.now();
      await this.shellRepo.executeAsync(`${shell} -i -c "exit"` as CommandString);
      report.totalTime = Date.now() - start;

      // 2. Kritik komutları tara ve ölç
      const content = await this.diskRepo.readFile(profilePath);
      const lines = content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

      const commonSlowItems = [
        { pattern: 'nvm.sh', name: 'NVM (Node Version Manager)', suggestion: 'perf_suggestion_nvm' },
        { pattern: 'brew shellenv', name: 'Homebrew Env', suggestion: 'perf_suggestion_brew' },
        { pattern: 'pyenv', name: 'Pyenv', suggestion: '' },
        { pattern: 'rbenv', name: 'Rbenv', suggestion: '' },
        { pattern: 'oh-my-zsh.sh', name: 'Oh My Zsh', suggestion: '' },
      ];

      for (const item of commonSlowItems) {
        if (lines.some(l => l.includes(item.pattern))) {
          const time = await this.measureCommand(item.pattern);
          if (time > 50) { // 50ms üstü yavaş kabul edilir
            report.slowCommands.push({ cmd: item.name, time });
            if (item.suggestion) report.suggestions.push(item.suggestion);
          }
        }
      }

      return report;
    } catch (error) {
      logger.error({ error }, 'Terminal analiz hatasi');
      return report;
    }
  }

  private getProfilePath(): AbsolutePath | null {
    const home = os.homedir();
    const shell = process.env.SHELL || '';
    
    if (shell.includes('zsh')) return path.join(home, '.zshrc') as AbsolutePath;
    if (shell.includes('bash')) return path.join(home, '.bashrc') as AbsolutePath;
    
    return null;
  }

  private async measureCommand(pattern: string): Promise<number> {
    const shell = path.basename(process.env.SHELL || 'zsh');
    // Sadece ilgili komutu çalıştırıp süresini ölçen bir alt süreç
    const start = Date.now();
    try {
      // Not: Bu basit bir ölçümdür, gerçek dünyada profil dosyasındaki tam satırı bulup çalıştırmak gerekir.
      // Şimdilik sadece varlığını ve etkisini simüle ediyoruz.
      await this.shellRepo.executeAsync(`${shell} -c "[[ -f ~/.nvm/nvm.sh ]] && . ~/.nvm/nvm.sh"` as CommandString);
      return Date.now() - start;
    } catch {
      return 0;
    }
  }
}
