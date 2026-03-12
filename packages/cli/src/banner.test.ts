import { describe, it, expect, vi, beforeEach } from 'vitest';
import { printBanner } from './banner.js';

describe('printBanner', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  it('writes output to stdout without throwing', () => {
    expect(() => printBanner('0.0.1')).not.toThrow();
  });

  it('includes the version in output', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    printBanner('1.2.3');
    const allOutput = writeSpy.mock.calls.map((args) => String(args[0])).join('');
    expect(allOutput).toContain('1.2.3');
  });

  it('includes LONGCELOT-SEO in output', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    printBanner('0.0.1');
    const allOutput = writeSpy.mock.calls.map((args) => String(args[0])).join('');
    expect(allOutput.toLowerCase()).toContain('longcelot-seo');
  });
});
