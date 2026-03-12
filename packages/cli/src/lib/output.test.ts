import { describe, it, expect } from 'vitest';
import {
  formatAsPrompt,
  formatAsJson,
  formatAsMarkdown,
  formatAsTable,
  formatOutput,
} from './output.js';
import type { ScanResult } from '@longcelot-seo/core';

const mockResult: ScanResult = {
  target: 'src/app/page.tsx',
  type: 'codebase',
  framework: 'nextjs',
  scannedAt: '2024-01-01T00:00:00.000Z',
  violations: [
    {
      ruleId: 'missing-title',
      message: 'Missing <title> in Metadata export',
      severity: 'critical',
      location: 'src/app/page.tsx',
    },
    {
      ruleId: 'missing-alt-text',
      message: '<img> missing alt attribute',
      severity: 'high',
      location: 'src/components/Hero.tsx',
      line: 24,
    },
  ],
};

const emptyResult: ScanResult = {
  target: 'src/app/about.tsx',
  type: 'codebase',
  framework: 'nextjs',
  scannedAt: '2024-01-01T00:00:00.000Z',
  violations: [],
};

describe('formatAsPrompt', () => {
  it('returns no-issues message when results are empty', () => {
    const output = formatAsPrompt([emptyResult]);
    expect(output).toContain('No SEO issues found');
  });

  it('includes all violations in output', () => {
    const output = formatAsPrompt([mockResult]);
    expect(output).toContain('[CRITICAL]');
    expect(output).toContain('Missing <title>');
    expect(output).toContain('[HIGH]');
    expect(output).toContain('missing alt attribute');
  });

  it('orders critical violations before high violations', () => {
    const output = formatAsPrompt([mockResult]);
    const critIdx = output.indexOf('[CRITICAL]');
    const highIdx = output.indexOf('[HIGH]');
    expect(critIdx).toBeLessThan(highIdx);
  });

  it('includes "expert SEO engineer" header', () => {
    const output = formatAsPrompt([mockResult]);
    expect(output).toContain('expert SEO engineer');
  });
});

describe('formatAsJson', () => {
  it('returns valid JSON', () => {
    const output = formatAsJson([mockResult]);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('includes all violations', () => {
    const output = formatAsJson([mockResult]);
    const parsed = JSON.parse(output) as ScanResult[];
    expect(parsed[0]?.violations).toHaveLength(2);
  });
});

describe('formatAsMarkdown', () => {
  it('returns no-issues message when empty', () => {
    const output = formatAsMarkdown([emptyResult]);
    expect(output).toContain('No issues found');
  });

  it('includes violation details', () => {
    const output = formatAsMarkdown([mockResult]);
    expect(output).toContain('CRITICAL');
    expect(output).toContain('Missing <title>');
  });

  it('includes target file as header', () => {
    const output = formatAsMarkdown([mockResult]);
    expect(output).toContain('src/app/page.tsx');
  });
});

describe('formatAsTable', () => {
  it('returns no-issues message when empty', () => {
    const output = formatAsTable([emptyResult]);
    expect(output).toContain('No SEO issues found');
  });

  it('includes violation details', () => {
    const output = formatAsTable([mockResult]);
    expect(output).toContain('CRITICAL');
    expect(output).toContain('Missing <title>');
  });
});

describe('formatOutput', () => {
  it('delegates to formatAsPrompt for prompt format', () => {
    const output = formatOutput([emptyResult], 'prompt');
    expect(output).toContain('No SEO issues found');
  });

  it('delegates to formatAsJson for json format', () => {
    const output = formatOutput([emptyResult], 'json');
    expect(() => JSON.parse(output)).not.toThrow();
  });

  it('delegates to formatAsMarkdown for markdown format', () => {
    const output = formatOutput([emptyResult], 'markdown');
    expect(output).toContain('## SEO Scan Results');
  });

  it('delegates to formatAsTable for table format', () => {
    const output = formatOutput([emptyResult], 'table');
    expect(output).toContain('No SEO issues found');
  });
});
