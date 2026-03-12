/**
 * @longcelot-seo/scanner — Phase 2 & 3 implementation.
 *
 * This package will contain:
 *   - src/ast/walker.ts       — Typed file walker
 *   - src/ast/jsx-parser.ts   — Babel AST → RuleViolation[]
 *   - src/ast/vue-parser.ts   — @vue/compiler-sfc → RuleViolation[]
 *   - src/url/fetcher.ts      — Typed HTTP fetch
 *   - src/url/crawler.ts      — BFS multi-page crawler
 *   - src/url/cheerio-adapter.ts — Cheerio DOM → rule engine
 *
 * Currently a stub — implementation starts in Phase 2.
 */

export type { ScanResult, RuleViolation, ScanOptions, UrlScanOptions } from '@longcelot-seo/core';
