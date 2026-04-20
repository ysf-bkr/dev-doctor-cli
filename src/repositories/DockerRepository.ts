import { execSync } from 'child_process';
import { CommandString } from '../types/index.js';

export class DockerRepository {
  execute(command: CommandString): string {
    return execSync(command, { encoding: 'utf8' });
  }

  isInstalled(): boolean {
    try {
      execSync('docker --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}
