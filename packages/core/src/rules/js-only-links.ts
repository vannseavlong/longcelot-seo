/**
 * Rule: js-only-links
 * Checks for links without href (JS-only navigation)
 */

import type { RuleViolation, RuleId, Severity } from '../types.js';
import type { RuleContext } from '../engine.js';

export const ruleId: RuleId = 'js-only-links';
const severity: Severity = 'high';

export function jsOnlyLinksRule(context: RuleContext): RuleViolation[] {
  const { filePath, extension, jsxMetadata } = context;
  const violations: RuleViolation[] = [];

  // Only check JSX/TSX files for this rule
  if (extension === 'tsx' || extension === 'jsx' || extension === 'ts' || extension === 'js') {
    if (jsxMetadata?.links) {
      for (const link of jsxMetadata.links) {
        if (link.isJsLink || (link.href === null && link.line > 0)) {
          violations.push({
            ruleId,
            message: '<a> without href (JS-only navigation)',
            severity,
            location: filePath,
            line: link.line,
          });
        }
      }
    }
  }

  return violations;
}