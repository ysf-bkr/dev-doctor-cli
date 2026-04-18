import { describe, it, expect, vi } from 'vitest';
import { EnvService } from '../services/EnvService.js';
import fs from 'fs-extra';

vi.mock('fs-extra');

describe('EnvService', () => {
  const envService = new EnvService();

  it('should detect missing environment variables', async () => {
    vi.mocked(fs.pathExists).mockResolvedValue(true as never);
    vi.mocked(fs.readFile).mockResolvedValueOnce('DB_HOST=localhost' as never); // .env
    vi.mocked(fs.readFile).mockResolvedValueOnce('DB_HOST=\nAPI_KEY=' as never); // .env.example

    const result = await envService.validate('./');
    expect(result.missing).toContain('API_KEY');
    expect(result.missing).not.toContain('DB_HOST');
  });
});
