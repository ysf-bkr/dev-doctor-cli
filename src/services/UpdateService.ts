import os from 'os';
import { logger } from '../utils/index.js';
import { ShellRepository } from '../repositories/index.js';
import { CommandString } from '../types/index.js';

export interface UpdateTool {
  name: string;
  checkCmd: string;
  updateCmd: string;
}

export class UpdateService {
  private readonly tools: UpdateTool[] = [
    { name: 'Homebrew', checkCmd: 'brew --version', updateCmd: 'brew update && brew upgrade' },
    { name: 'npm (Global)', checkCmd: 'npm --version', updateCmd: 'npm install -g npm@latest' },
    { name: 'pnpm (Global)', checkCmd: 'pnpm --version', updateCmd: 'pnpm add -g pnpm@latest' },
    { name: 'Rust (rustup)', checkCmd: 'rustup --version', updateCmd: 'rustup update' },
    { name: 'Bun', checkCmd: 'bun --version', updateCmd: 'bun upgrade' },
  ];

  constructor(private readonly shellRepo = new ShellRepository()) {}

  /**
   * Sistemde kurulu olan ve güncellenebilir araçları döndürür.
   */
  getAvailableTools(): UpdateTool[] {
    return this.tools.filter(tool => this.shellRepo.isInstalled(tool.checkCmd));
  }

  /**
   * macOS sistem güncellemelerini listeye ekler.
   */
  getSystemUpdate(): UpdateTool | null {
    if (os.platform() === 'darwin') {
      return { name: 'macOS Software Update', checkCmd: 'softwareupdate -l', updateCmd: 'softwareupdate -ia' };
    }
    return null;
  }

  /**
   * Belirli bir aracı günceller.
   */
  async updateTool(tool: UpdateTool): Promise<boolean> {
    try {
      await this.shellRepo.executeAsync(tool.updateCmd as CommandString);
      return true;
    } catch (error) {
      logger.error({ tool: tool.name, error }, 'Guncelleme hatasi');
      return false;
    }
  }
}
