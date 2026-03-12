/**
 * Core types for longcelot-seo.
 * All interfaces must be kept strict — no `any` allowed.
 */

/** Severity levels for SEO rule violations */
export type Severity = 'critical' | 'high' | 'medium' | 'low';

/** SEO rule identifiers */
export type RuleId =
  | 'missing-title'
  | 'missing-meta-description'
  | 'missing-h1'
  | 'duplicate-h1'
  | 'missing-alt-text'
  | 'hash-routing'
  | 'js-only-links'
  | 'missing-canonical'
  | 'missing-og-tags'
  | 'missing-structured-data';

/** Output format options */
export type OutputFormat = 'prompt' | 'json' | 'markdown' | 'table';

/** Supported framework types */
export type FrameworkType = 'nextjs' | 'nuxt' | 'vue' | 'react' | 'auto' | 'unknown';

/** A single SEO rule violation found in a file or page */
export interface RuleViolation {
  /** Rule that triggered the violation */
  ruleId: RuleId;
  /** Human-readable description of the issue */
  message: string;
  /** Severity level */
  severity: Severity;
  /** File path or URL where the violation was found */
  location: string;
  /** Line number (if applicable) */
  line?: number;
  /** Column number (if applicable) */
  column?: number;
  /** Optional contextual snippet */
  snippet?: string;
}

/** The full result of scanning a file or URL */
export interface ScanResult {
  /** Absolute path or URL that was scanned */
  target: string;
  /** Type of scan performed */
  type: 'codebase' | 'url';
  /** Framework detected or specified */
  framework: FrameworkType;
  /** All violations found */
  violations: RuleViolation[];
  /** ISO timestamp of when the scan ran */
  scannedAt: string;
}

/** Options for the codebase scanner */
export interface ScanOptions {
  /** Root directory to scan */
  dir: string;
  /** Framework override (default: 'auto') */
  framework: FrameworkType;
  /** Output format */
  output: OutputFormat;
  /** Write output to file instead of stdout */
  file: string | null;
  /** Comma-separated rule IDs to run (empty = all rules) */
  rules: RuleId[];
  /** Print all files scanned, not just violations */
  verbose: boolean;
  /** Exit code 1 if any critical violations found */
  ci: boolean;
}

/** Options for the URL scanner */
export interface UrlScanOptions {
  /** URL to scan */
  url: string;
  /** Crawl depth (default: 1) */
  depth: number;
  /** Max pages to crawl (default: 50) */
  limit: number;
  /** Output format */
  output: OutputFormat;
  /** Write output to file */
  file: string | null;
  /** Run PageSpeed Insights on each URL */
  psi: boolean;
  /** Compare with another URL */
  compare: string | null;
  /** Auto-discover URLs from sitemap.xml */
  sitemap: boolean;
  /** Custom user agent string */
  userAgent: string;
}

/** User context for DB adapter calls */
export interface UserContext {
  userId: string;
  accessToken: string;
  /** For staging only: the user's own Google Sheet ID */
  actorSheetId?: string;
}

/** Shared interface both DB adapters must implement */
export interface IDatabaseAdapter {
  withUserContext(ctx: UserContext): unknown;
}

/** Config schema loaded from lseo.config.js */
export interface LseoConfig {
  scan: {
    include: string[];
    exclude: string[];
    framework: FrameworkType;
  };
  url: {
    timeout: number;
    followRedirects: boolean;
    delay: number;
    userAgent: string;
  };
  output: {
    format: OutputFormat;
    outputFile: string | null;
  };
  rules: {
    missingTitle: boolean;
    missingMetaDescription: boolean;
    missingH1: boolean;
    duplicateH1: boolean;
    missingAltText: boolean;
    hashRouting: boolean;
    jsOnlyLinks: boolean;
    missingCanonical: boolean;
    missingOgTags: boolean;
    missingStructuredData: boolean;
  };
}
