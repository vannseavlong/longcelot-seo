import type { ScanResult, RuleViolation, OutputFormat } from '@longcelot-seo/core';
import { SEVERITY_ORDER } from '@longcelot-seo/core';

/** Sort violations from most to least severe. */
function sortViolations(violations: RuleViolation[]): RuleViolation[] {
  return [...violations].sort((a, b) => {
    const aOrder = SEVERITY_ORDER[a.severity] ?? 99;
    const bOrder = SEVERITY_ORDER[b.severity] ?? 99;
    return aOrder - bOrder;
  });
}

/** Format a single violation as a prompt line. */
function formatViolationLine(v: RuleViolation): string {
  const loc = v.line != null ? `${v.location} line ${v.line}` : v.location;
  return `[${v.severity.toUpperCase()}] ${loc} — ${v.message}`;
}

/** Generate an AI agent prompt from scan results. */
export function formatAsPrompt(results: ScanResult[]): string {
  const allViolations = results.flatMap((r) =>
    sortViolations(r.violations).map((v) => formatViolationLine(v)),
  );

  if (allViolations.length === 0) {
    return '✅ No SEO issues found. Your project looks great!';
  }

  const header = [
    'You are an expert SEO engineer reviewing a web project.',
    'Fix every issue below. Show the exact file edit for each.',
    '',
  ].join('\n');

  return header + allViolations.join('\n');
}

/** Format scan results as a JSON string. */
export function formatAsJson(results: ScanResult[]): string {
  return JSON.stringify(results, null, 2);
}

/** Format scan results as Markdown. */
export function formatAsMarkdown(results: ScanResult[]): string {
  if (results.length === 0) return '## SEO Scan Results\n\nNo issues found.\n';

  const lines: string[] = ['## SEO Scan Results\n'];

  for (const result of results) {
    lines.push(`### ${result.target}\n`);
    const sorted = sortViolations(result.violations);

    if (sorted.length === 0) {
      lines.push('✅ No issues found.\n');
      continue;
    }

    for (const v of sorted) {
      const loc = v.line != null ? ` (line ${v.line})` : '';
      lines.push(`- **[${v.severity.toUpperCase()}]** \`${v.location}\`${loc}: ${v.message}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/** Format scan results as a plain text table. */
export function formatAsTable(results: ScanResult[]): string {
  const allViolations: Array<{ severity: string; location: string; message: string }> =
    results.flatMap((r) =>
      sortViolations(r.violations).map((v) => ({
        severity: v.severity.toUpperCase(),
        location: v.line != null ? `${v.location}:${v.line}` : v.location,
        message: v.message,
      })),
    );

  if (allViolations.length === 0) return '✅ No SEO issues found.\n';

  const colWidths = {
    severity: Math.max(8, ...allViolations.map((v) => v.severity.length)),
    location: Math.max(8, ...allViolations.map((v) => v.location.length)),
    message: Math.max(7, ...allViolations.map((v) => v.message.length)),
  };

  const sep = `+${'-'.repeat(colWidths.severity + 2)}+${'-'.repeat(colWidths.location + 2)}+${'-'.repeat(colWidths.message + 2)}+`;
  const header = `| ${'SEVERITY'.padEnd(colWidths.severity)} | ${'LOCATION'.padEnd(colWidths.location)} | ${'MESSAGE'.padEnd(colWidths.message)} |`;

  const rows = allViolations.map(
    (v) =>
      `| ${v.severity.padEnd(colWidths.severity)} | ${v.location.padEnd(colWidths.location)} | ${v.message.padEnd(colWidths.message)} |`,
  );

  return [sep, header, sep, ...rows, sep].join('\n') + '\n';
}

/**
 * Format scan results in the requested format.
 * This is the single export point for all output formatting.
 */
export function formatOutput(results: ScanResult[], format: OutputFormat): string {
  switch (format) {
    case 'prompt':
      return formatAsPrompt(results);
    case 'json':
      return formatAsJson(results);
    case 'markdown':
      return formatAsMarkdown(results);
    case 'table':
      return formatAsTable(results);
  }
}
