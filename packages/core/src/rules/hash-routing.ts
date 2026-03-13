/**
 * Rule: hash-routing
 * Detects hash-based routing patterns
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'hash-routing';
const severity: Severity = 'high';

export function hashRoutingRule(context: RuleContext): RuleViolation[] {
  const { filePath, contents } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check for hash routing patterns
  const hashRoutingPatterns = [
    /useHashRouter\s*\(/,
    /<HashRouter/,
    /createBrowserHashHistory/,
    /createHashHistory/,
  ];

  for (const pattern of hashRoutingPatterns) {
    if (pattern.test(contents)) {
      violations.push({
        ruleId,
        message: 'Hash-based routing detected (not ideal for SEO)',
        severity,
        location: filePath,
        line,
      });
      break;
    }
  }

  return violations;
}