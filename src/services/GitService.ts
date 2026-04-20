import { logger } from '../utils/index.js';
import { GitRepository } from '../repositories/index.js';
import { CommandString } from '../types/index.js';

export class GitService {
  constructor(private readonly gitRepo = new GitRepository()) {}

  /**
   * Mevcut dizinin bir git reposu olup olmadığını kontrol eder.
   */
  isRepo(): boolean {
    return this.gitRepo.isInsideRepo();
  }

  /**
   * Takip edilmeyen dosyaları (untracked) ve git cache'ini temizler.
   */
  async cleanRepo(): Promise<{ output: string }> {
    try {
      if (!this.gitRepo.isInsideRepo()) {
        return { output: 'Hata: Git deposu bulunamadı.' };
      }
      const output = this.gitRepo.execute('git clean -fdx' as CommandString);
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
      if (!this.gitRepo.isInsideRepo()) {
        return 'Not a git repo';
      }
      return this.gitRepo.execute('git status -s' as CommandString).trim() || 'Clean';
    } catch (error) {
      return 'Hata: Durum alınamadı.';
    }
  }
}
