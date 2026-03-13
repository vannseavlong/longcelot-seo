/**
 * Rule: missing-alt-text
 * Checks if images have alt attributes
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'missing-alt-text';
const severity: Severity = 'high';

export function missingAltTextRule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata?.images) {
      for (const img of jsxMetadata.images) {
        if (!img.alt || img.alt.trim() === '') {
          violations.push({
            ruleId,
            message: '<img> missing alt attribute',
            severity,
            location: filePath,
            line: img.line,
          });
        }
      }
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata?.images) {
      for (const img of vueMetadata.images) {
        if (!img.alt || img.alt.trim() === '') {
          violations.push({
            ruleId,
            message: '<img> missing alt attribute',
            severity,
            location: filePath,
            line: img.line,
          });
        }
      }
    }
  }

  return violations;
}