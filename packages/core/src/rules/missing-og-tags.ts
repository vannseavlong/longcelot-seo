/**
 * Rule: missing-og-tags
 * Checks for Open Graph meta tags
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'missing-og-tags';
const severity: Severity = 'medium';

export function missingOgTagsRule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata?.hasMetadataExport && !jsxMetadata.hasOgTags) {
      violations.push({
        ruleId,
        message: 'Open Graph tags missing in Metadata',
        severity,
        location: filePath,
        line,
      });
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata && !vueMetadata.hasOgTags) {
      violations.push({
        ruleId,
        message: 'Open Graph meta tags missing',
        severity,
        location: filePath,
        line,
      });
    }
  }

  return violations;
}