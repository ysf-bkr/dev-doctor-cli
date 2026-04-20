import { execSync } from 'child_process';
import { CommandString } from '../types/index.js';

export class GitRepository {
  execute(command: CommandString): string {
    return execSync(command, { encoding: 'utf8' });
  }

  isInstalled(): boolean {
    try {
      execSync('git --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  isInsideRepo(): boolean {
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}
