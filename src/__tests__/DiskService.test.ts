import { describe, it, expect, vi } from 'vitest';
import { DiskService } from '../services/DiskService.js';

describe('DiskService', () => {
  const diskService = new DiskService();

  it('should format size correctly', () => {
    expect(diskService.formatSize(0)).toBe('0 B');
    expect(diskService.formatSize(1024)).toBe('1 KB');
    expect(diskService.formatSize(1024 * 1024)).toBe('1 MB');
  });

  it('should identify protected paths', () => {
    const isProtected = (diskService as any).isProtected('/Users/ybekar/app', '/Users/ybekar/app');
    expect(isProtected).toBe(true);
  });

  it('should handle root check across platforms', () => {
    // This just ensures it doesn't crash
    const root = diskService.isRoot();
    expect(typeof root).toBe('boolean');
  });
});
