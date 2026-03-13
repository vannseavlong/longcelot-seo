/**
 * Rule: duplicate-h1
 * Checks if a file has more than one H1 element
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'duplicate-h1';
const severity: Severity = 'high';

export function duplicateH1Rule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata && jsxMetadata.h1Count > 1) {
      violations.push({
        ruleId,
        message: `Multiple <h1> found (${jsxMetadata.h1Count} instances)`,
        severity,
        location: filePath,
        line,
      });
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata && vueMetadata.h1Count > 1) {
      violations.push({
        ruleId,
        message: `Multiple <h1> found (${vueMetadata.h1Count} instances)`,
        severity,
        location: filePath,
        line,
      });
    }
  }

  return violations;
}