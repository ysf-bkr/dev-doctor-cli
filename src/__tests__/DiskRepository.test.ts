import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiskRepository } from '../repositories/DiskRepository.js';
import fs from 'fs-extra';
import { glob } from 'glob';

vi.mock('fs-extra');
vi.mock('glob');

describe('DiskRepository', () => {
  let repo: DiskRepository;

  beforeEach(() => {
    repo = new DiskRepository();
    vi.clearAllMocks();
  });

  it('exists calls fs.pathExists', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    const res = await repo.exists('/test');
    expect(res).toBe(true);
    expect(fs.pathExists).toHaveBeenCalledWith('/test');
  });

  it('findMatches calls glob', async () => {
    vi.mocked(glob).mockResolvedValue(['/test/file.txt'] as any);
    const res = await repo.findMatches('**/*.txt');
    expect(res).toEqual(['/test/file.txt']);
    expect(glob).toHaveBeenCalledWith('**/*.txt', { absolute: true });
  });

  it('readFile calls fs.readFile', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('content' as any);
    const res = await repo.readFile('/test/file.txt');
    expect(res).toBe('content');
    expect(fs.readFile).toHaveBeenCalledWith('/test/file.txt', 'utf8');
  });
});
