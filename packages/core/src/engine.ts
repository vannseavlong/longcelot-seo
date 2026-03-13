/**
 * Rule engine - runs all SEO rules against parsed files.
 */

import type { RuleId, RuleViolation, ScanResult, FrameworkType } from './types.js';

/** Rule function signature */
export type RuleFunction = (context: RuleContext) => RuleViolation[];

/** Context passed to each rule */
export interface RuleContext {
  /** File path relative to scan root */
  filePath: string;
  /** File extension */
  extension: string;
  /** Framework detected */
  framework: FrameworkType;
  /** Raw file contents */
  contents: string;
  /** Parsed JSX metadata (if JSX/TSX file) */
  jsxMetadata?: JsxMetadata;
  /** Parsed Vue metadata (if Vue file) */
  vueMetadata?: VueMetadata;
}

/** JSX/TSX file metadata */
export interface JsxMetadata {
  hasTitleExport: boolean;
  hasHeadElement: boolean;
  hasMetadataExport: boolean;
  hasGetLayout: boolean;
  hasGetServerSideProps: boolean;
  hasGetStaticProps: boolean;
  images: { src: string | null; alt: string | null; line: number }[];
  links: { href: string | null; isHashLink: boolean; isJsLink: boolean; line: number }[];
  h1Count: number;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
}

/** Vue file metadata */
export interface VueMetadata {
  hasTitle: boolean;
  hasMetaDescription: boolean;
  images: { src: string | null; alt: string | null; line: number }[];
  h1Count: number;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
}

/** Registry of all rules */
const rules: Partial<Record<RuleId, RuleFunction>> = {};

/**
 * Registers a rule.
 */
export function registerRule(id: RuleId, fn: RuleFunction): void {
  rules[id] = fn;
}

/**
 * Runs all rules against a file context.
 */
export function runRules(context: RuleContext, enabledRules?: RuleId[]): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const ruleIds = enabledRules ?? (Object.keys(rules) as RuleId[]);

  for (const ruleId of ruleIds) {
    const rule = rules[ruleId];
    if (rule) {
      try {
        const result = rule(context);
        violations.push(...result);
      } catch {
        // Skip rules that fail - don't block scanning
        continue;
      }
    }
  }

  return violations;
}

/**
 * Runs rules and returns a ScanResult.
 */
export function scanFile(
  filePath: string,
  extension: string,
  framework: FrameworkType,
  contents: string,
  jsxMetadata?: JsxMetadata,
  vueMetadata?: VueMetadata,
  enabledRules?: RuleId[]
): ScanResult {
  const context: RuleContext = {
    filePath,
    extension,
    framework,
    contents,
    ...(jsxMetadata ? { jsxMetadata } : {}),
    ...(vueMetadata ? { vueMetadata } : {}),
  };

  const violations = runRules(context, enabledRules);

  return {
    target: filePath,
    type: 'codebase',
    framework,
    violations,
    scannedAt: new Date().toISOString(),
  };
}

// Import and register all rules
import { missingTitleRule } from './rules/missing-title.js';
import { missingMetaDescRule } from './rules/missing-meta-desc.js';
import { missingH1Rule } from './rules/missing-h1.js';
import { duplicateH1Rule } from './rules/duplicate-h1.js';
import { missingAltTextRule } from './rules/missing-alt-text.js';
import { jsOnlyLinksRule } from './rules/js-only-links.js';
import { hashRoutingRule } from './rules/hash-routing.js';
import { missingCanonicalRule } from './rules/missing-canonical.js';
import { missingOgTagsRule } from './rules/missing-og-tags.js';
import { missingStructuredDataRule } from './rules/missing-structured-data.js';

// Register all rules
registerRule('missing-title', missingTitleRule);
registerRule('missing-meta-description', missingMetaDescRule);
registerRule('missing-h1', missingH1Rule);
registerRule('duplicate-h1', duplicateH1Rule);
registerRule('missing-alt-text', missingAltTextRule);
registerRule('js-only-links', jsOnlyLinksRule);
registerRule('hash-routing', hashRoutingRule);
registerRule('missing-canonical', missingCanonicalRule);
registerRule('missing-og-tags', missingOgTagsRule);
registerRule('missing-structured-data', missingStructuredDataRule);