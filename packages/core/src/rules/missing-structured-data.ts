/**
 * Rule: missing-structured-data
 * Checks for JSON-LD structured data
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'missing-structured-data';
const severity: Severity = 'medium';

export function missingStructuredDataRule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata && !jsxMetadata.hasStructuredData) {
      violations.push({
        ruleId,
        message: 'No JSON-LD structured data found',
        severity,
        location: filePath,
        line,
      });
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata && !vueMetadata.hasStructuredData) {
      violations.push({
        ruleId,
        message: 'No JSON-LD structured data found',
        severity,
        location: filePath,
        line,
      });
    }
  }

  return violations;
}