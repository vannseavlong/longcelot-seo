/**
 * AI prompt generator - converts scan results to an AI-ready prompt.
 */

import type { ScanResult, RuleViolation, Severity } from '@longcelot-seo/core';

const SEVERITY_PREFIX: Record<Severity, string> = {
  critical: '[CRITICAL]',
  high: '[HIGH]',
  medium: '[MEDIUM]',
  low: '[LOW]',
};

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/**
 * Sorts violations by severity (critical first).
 */
function sortViolationsBySeverity(violations: RuleViolation[]): RuleViolation[] {
  return [...violations].sort((a, b) => {
    const aOrder = SEVERITY_ORDER[a.severity];
    const bOrder = SEVERITY_ORDER[b.severity];
    if (aOrder !== bOrder) return aOrder - bOrder;
    // Then by file path
    return a.location.localeCompare(b.location);
  });
}

/**
 * Generates an AI agent prompt from scan results.
 */
export function generatePrompt(results: ScanResult[]): string {
  // Aggregate all violations
  const allViolations: (RuleViolation & { file: string })[] = [];

  for (const result of results) {
    for (const violation of result.violations) {
      allViolations.push({
        ...violation,
        file: result.target,
      });
    }
  }

  // Sort by severity
  const sorted = sortViolationsBySeverity(allViolations);

  if (sorted.length === 0) {
    return `You are an expert SEO engineer reviewing a codebase.
No SEO issues were found. The codebase appears to be well-optimized for search engines.

Great job!`;
  }

  // Build the prompt
  const lines: string[] = [
    'You are an expert SEO engineer reviewing a codebase.',
    'Fix every issue below. Show the exact file edit for each.',
    '',
  ];

  // Group by severity
  for (const severity of ['critical', 'high', 'medium', 'low'] as Severity[]) {
    const items = sorted.filter((v) => v.severity === severity);
    if (items.length === 0) continue;

    for (const violation of items) {
      const prefix = SEVERITY_PREFIX[violation.severity];
      const lineInfo = violation.line ? ` line ${violation.line}` : '';
      lines.push(`${prefix} ${violation.location}${lineInfo} — ${violation.message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generates a summary of scan results.
 */
export function generateSummary(results: ScanResult[]): string {
  const totalFiles = results.length;
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);

  const bySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const result of results) {
    for (const v of result.violations) {
      bySeverity[v.severity]++;
    }
  }

  return `Scanned ${totalFiles} file(s) and found ${totalViolations} issue(s):
  - Critical: ${bySeverity.critical}
  - High: ${bySeverity.high}
  - Medium: ${bySeverity.medium}
  - Low: ${bySeverity.low}`;
}