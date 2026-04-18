import { describe, it, expect } from 'vitest';
import { t, setLocale } from '../config/index.js';

describe('i18n Service', () => {
  it('should translate correctly in English', () => {
    setLocale('en');
    expect(t('common_exit')).toBe('Exit');
  });

  it('should translate correctly in Turkish', () => {
    setLocale('tr');
    expect(t('common_exit')).toBe('Cikis');
  });

  it('should handle interpolation', () => {
    setLocale('en');
    // dummy test for interpolation if we have any
    // e.g., t('delete_confirm', { size: '10MB' })
    const result = t('delete_confirm', { size: '10 MB' });
    expect(result).toContain('10 MB');
  });
});
