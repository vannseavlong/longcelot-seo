/**
 * Rule: missing-h1
 * Checks if a file has at least one H1 element
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'missing-h1';
const severity: Severity = 'high';

export function missingH1Rule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata && jsxMetadata.h1Count === 0) {
      violations.push({
        ruleId,
        message: 'No <h1> found in rendered output',
        severity,
        location: filePath,
        line,
      });
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata && vueMetadata.h1Count === 0) {
      violations.push({
        ruleId,
        message: 'No <h1> found in template',
        severity,
        location: filePath,
        line,
      });
    }
  }

  return violations;
}