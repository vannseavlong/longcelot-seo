/**
 * Shared constants for longcelot-seo.
 */

/** Brand sky-blue hex color used in terminal output */
export const BRAND_COLOR = '#0EA5E9' as const;

/** CLI command name */
export const CLI_NAME = 'lseo' as const;

/** npm package name */
export const PACKAGE_NAME = 'longcelot-seo' as const;

/** Default user agent for URL scanning */
export const DEFAULT_USER_AGENT = 'longcelot-seo-bot/1.0' as const;

/** Default crawl delay in milliseconds */
export const DEFAULT_CRAWL_DELAY_MS = 300 as const;

/** Default crawl depth */
export const DEFAULT_CRAWL_DEPTH = 1 as const;

/** Default max pages to crawl */
export const DEFAULT_CRAWL_LIMIT = 50 as const;

/** Default URL scan timeout in milliseconds */
export const DEFAULT_URL_TIMEOUT_MS = 15000 as const;

/** Severity order (highest → lowest) for sorting violations */
export const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
} as const;

/** Default lseo.config.js values */
export const DEFAULT_CONFIG = {
  scan: {
    include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
    exclude: ['node_modules', 'dist', '.next'],
    framework: 'auto' as const,
  },
  url: {
    timeout: DEFAULT_URL_TIMEOUT_MS,
    followRedirects: true,
    delay: DEFAULT_CRAWL_DELAY_MS,
    userAgent: DEFAULT_USER_AGENT,
  },
  output: {
    format: 'prompt' as const,
    outputFile: null,
  },
  rules: {
    missingTitle: true,
    missingMetaDescription: true,
    missingH1: true,
    duplicateH1: true,
    missingAltText: true,
    hashRouting: true,
    jsOnlyLinks: true,
    missingCanonical: true,
    missingOgTags: true,
    missingStructuredData: true,
  },
} as const;
