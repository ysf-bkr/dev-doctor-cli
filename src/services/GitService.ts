import { execSync } from 'child_process';
import { logger } from '../utils/index.js';

export class GitService {
  /**
   * Mevcut dizinin bir git reposu olup olmadığını kontrol eder.
   */
  isRepo(): boolean {
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Takip edilmeyen dosyaları (untracked) ve git cache'ini temizler.
   */
  async cleanRepo(): Promise<{ output: string }> {
    try {
      // -f: force, -d: directories, -x: ignored files too
      const output = execSync('git clean -fdx', { encoding: 'utf8' });
      return { output: output || 'Repository is already clean.' };
    } catch (error) {
      logger.error({ error }, 'Git temizleme hatasi');
      return { output: 'Hata: Git temizliği yapılamadı.' };
    }
  }

  /**
   * Repo durumunu (branch, changes) özetler.
   */
  async getStatus(): Promise<string> {
    try {
      return execSync('git status -s', { encoding: 'utf8' }).trim() || 'Clean';
    } catch (error) {
      return 'Hata: Durum alınamadı.';
    }
  }
}
