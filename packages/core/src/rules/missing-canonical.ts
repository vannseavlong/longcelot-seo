/**
 * Rule: missing-canonical
 * Checks for canonical link tag
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'missing-canonical';
const severity: Severity = 'medium';

export function missingCanonicalRule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata?.hasMetadataExport && !jsxMetadata.hasCanonical) {
      violations.push({
        ruleId,
        message: 'Missing canonical tag in Metadata',
        severity,
        location: filePath,
        line,
      });
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata && !vueMetadata.hasCanonical) {
      violations.push({
        ruleId,
        message: 'Missing canonical link tag',
        severity,
        location: filePath,
        line,
      });
    }
  }

  return violations;
}