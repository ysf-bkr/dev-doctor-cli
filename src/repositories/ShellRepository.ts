import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import { CommandString } from '../types/index.js';

const execAsyncRaw = promisify(exec);

export class ShellRepository {
  async executeAsync(command: CommandString): Promise<{ stdout: string; stderr: string }> {
    return await execAsyncRaw(command);
  }

  execute(command: CommandString, options: { stdio?: 'ignore' | 'inherit' | 'pipe' } = {}): string {
    return execSync(command, { encoding: 'utf8', stdio: options.stdio });
  }

  isInstalled(command: string): boolean {
    try {
      // DÜZELTME: Komutu doğrudan stdio: ignore ile çalıştırarak sessizce kontrol et
      // Komutun kendisini (ör: git --version) test etmek en güvenli yoldur.
      execSync(command, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}
