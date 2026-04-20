import fs from 'fs-extra';
import { glob } from 'glob';
import { AbsolutePath } from '../types/index.js';

export class DiskRepository {
  async exists(path: string): Promise<boolean> {
    return await fs.pathExists(path);
  }

  async stat(path: string): Promise<fs.Stats> {
    return await fs.stat(path);
  }

  async readdir(path: string): Promise<string[]> {
    return await fs.readdir(path);
  }

  async remove(path: string): Promise<void> {
    await fs.remove(path);
  }

  async copy(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest);
  }

  async ensureDir(path: string): Promise<void> {
    await fs.ensureDir(path);
  }

  async findMatches(pattern: string): Promise<string[]> {
    return await glob(pattern, { absolute: true });
  }

  async readFile(path: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    return await fs.readFile(path, encoding);
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content);
  }
}
