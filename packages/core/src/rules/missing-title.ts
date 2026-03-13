/**
 * Rule: missing-title
 * Checks if a file has a title defined (via Metadata export or <Head>)
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'missing-title';
const severity: Severity = 'critical';

export function missingTitleRule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata, vueMetadata } = context;
  const violations: RuleViolation[] = [];
  const line = 1;

  // Check JSX/TSX files
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata) {
      // Next.js with Metadata API or classic <Head>
      if (!jsxMetadata.hasTitleExport && !jsxMetadata.hasHeadElement) {
        violations.push({
          ruleId,
          message: 'Missing <title> in Metadata export or <Head> component',
          severity,
          location: filePath,
          line,
        });
      }
    }
  }

  // Check Vue files
  if (extension === 'vue') {
    if (vueMetadata && !vueMetadata.hasTitle) {
      violations.push({
        ruleId,
        message: 'Missing <title> in template or useHead composable',
        severity,
        location: filePath,
        line,
      });
    }
  }

  return violations;
}