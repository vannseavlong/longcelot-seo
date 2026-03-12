import { describe, it, expect } from 'vitest';
import { BRAND_COLOR, DEFAULT_CONFIG, CLI_NAME, PACKAGE_NAME } from './index.js';

describe('constants', () => {
  it('BRAND_COLOR is sky-blue hex', () => {
    expect(BRAND_COLOR).toBe('#0EA5E9');
  });

  it('CLI_NAME is lseo', () => {
    expect(CLI_NAME).toBe('lseo');
  });

  it('PACKAGE_NAME is longcelot-seo', () => {
    expect(PACKAGE_NAME).toBe('longcelot-seo');
  });

  it('DEFAULT_CONFIG.output.format defaults to prompt', () => {
    expect(DEFAULT_CONFIG.output.format).toBe('prompt');
  });

  it('DEFAULT_CONFIG.scan.framework defaults to auto', () => {
    expect(DEFAULT_CONFIG.scan.framework).toBe('auto');
  });

  it('DEFAULT_CONFIG.rules all default to true', () => {
    for (const [, value] of Object.entries(DEFAULT_CONFIG.rules)) {
      expect(value).toBe(true);
    }
  });

  it('DEFAULT_CONFIG has correct default URL timeout', () => {
    expect(DEFAULT_CONFIG.url.timeout).toBe(15000);
  });
});
