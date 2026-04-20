import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import { CommandString } from '../types/index.js';

const execAsyncRaw = promisify(exec);

export class ShellRepository {
  async executeAsync(command: CommandString): Promise<{ stdout: string; stderr: string }> {
    return await execAsyncRaw(command);
  }

  execute(command: CommandString): string {
    return execSync(command, { encoding: 'utf8' });
  }

  isInstalled(command: string): boolean {
    try {
      execSync(command, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}
