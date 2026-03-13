/**
 * Rule: missing-meta-description
 * Checks if a file has a meta description defined
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'missing-meta-description';
const severity: Severity = 'critical';

export function missingMetaDescRule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata?.hasMetadataExport) {
      // If Metadata export exists, check if description is included
      // For simplicity, flag if metadata exists but we can't verify description
      // In a real implementation, we'd parse the Metadata object
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata && !vueMetadata.hasMetaDescription) {
      violations.push({
        ruleId,
        message: 'Missing meta description in template or useHead composable',
        severity,
        location: filePath,
        line,
      });
    }
  }

  return violations;
}