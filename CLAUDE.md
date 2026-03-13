# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```sh
# Install dependencies
pnpm install

# Build all packages (core → scanner → cli order matters)
pnpm build

# Run all tests
pnpm test

# Run tests for a single package
pnpm --filter longcelot-seo test
pnpm --filter @longcelot-seo/core test
pnpm --filter @longcelot-seo/scanner test

# Run a single test file
pnpm --filter @longcelot-seo/core vitest run src/rules/missing-title.test.ts

# Lint (zero warnings allowed)
pnpm lint

# Type-check all packages
pnpm typecheck

# Format
pnpm format
```

## Features

### URL Scanning (Phase 3)

The `lseo url` command scans live websites for SEO issues.

```sh
# Scan a single URL
lseo url https://example.com

# Scan with sitemap discovery
lseo url https://example.com --sitemap

# Crawl multiple pages (depth 2, limit 20)
lseo url https://example.com --depth 2 --limit 20

# Output as JSON or markdown
lseo url https://example.com --output json
lseo url https://example.com --output markdown

# Write results to file
lseo url https://example.com --file results.json
```

**URL-specific SEO rules (18 total):**
- missing-title, missing-meta-description, missing-h1, duplicate-h1
- missing-alt-text, hash-routing, js-only-links
- missing-canonical, missing-og-tags, missing-structured-data
- missing-lang-attr, title-too-short, title-too-long
- description-too-short, description-too-long, multiple-canonical
- missing-viewport, missing-charset

---

## Release Flow

```sh
# 1. Commit changes
git add <files> && git commit -m "feat: ..."

# 2. Bump version (edits packages/cli/package.json + creates git tag)
pnpm release:patch   # 0.0.x bug fix
pnpm release:minor   # 0.x.0 new feature
pnpm release:major   # x.0.0 breaking

# 3. Push → triggers publish.yml → npm publish + GitHub Release
git push origin main --follow-tags
```

> The published package is `longcelot-seo` (the CLI). `@longcelot-seo/core` and `@longcelot-seo/scanner` are private workspace packages bundled by tsup — never publish them.

---

## Architecture

This is a **pnpm monorepo** with three packages:

```
packages/
  core/     — shared types, rule definitions, rule engine
  scanner/  — AST parsers (Babel + Vue) and file walker
  cli/      — Commander.js CLI, config loader, output formatters
apps/       — (future) web platform
```

### Data Flow for `lseo scan`

```
lseo scan
  → loadConfig()                     (cli/lib/config.ts — cosmiconfig + Zod)
  → detectFramework()                (scanner/ast/framework-detector.ts)
  → walkFiles()                      (scanner/ast/walker.ts — fast-glob)
  → per file:
      parseJsx() / parseVue()        (scanner/ast/jsx-parser.ts | vue-parser.ts)
      extractViolations()            → RuleViolation[]
      runRules()                     (core/engine.ts — registered rule functions)
      deduplicate violations
  → formatOutput()                   (cli/lib/output.ts — prompt|json|markdown|table)
  → generateSummary()                (cli/lib/prompt-generator.ts)
  → stdout or file
  → exit 1 if --ci + critical violations
```

### Key Types (`packages/core/src/types.ts`)

- `RuleViolation` — `{ ruleId, message, severity, location, line?, column?, snippet? }`
- `ScanResult` — `{ target, type, framework, violations[], scannedAt }`
- `LseoConfig` — shape of `lseo.config.js`
- `FrameworkType` — `'nextjs' | 'nuxt' | 'vue' | 'react' | 'auto' | 'unknown'`

### Rule Engine (`packages/core/src/engine.ts`)

Rules are registered via `registerRule(id, fn)`. Each rule is a `(context: RuleContext) => RuleViolation[]` function. `RuleContext` carries `filePath`, `extension`, `framework`, `contents`, and optionally `jsxMetadata` or `vueMetadata` from the AST parsers.

All 10 rules live in `packages/core/src/rules/` and are auto-registered at the bottom of `engine.ts`.

### TypeScript Strictness

The root `tsconfig.json` enforces `strict`, `noImplicitAny`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. ESLint also bans `any`. Every rule and type must be strictly typed — no escape hatches.

---

## Progress Tracker

### Phase 1 — CLI SDK Core + Install Banner ✅ COMPLETE

**Published:** `longcelot-seo@0.0.2` on npm

Key decisions:
- `@longcelot-seo/core` and `@longcelot-seo/scanner` are **private** and bundled into the CLI's dist by tsup — they must never appear in published `dependencies`.
- Husky pre-commit: `pnpm lint && pnpm typecheck`.
- CI: `.github/workflows/ci.yml` (lint + typecheck + test on PR/push to main).
- Publish: `.github/workflows/publish.yml` (triggered by `v*` tag; requires `permissions: contents: write`).

### Phase 2 — Codebase Scanner ✅ COMPLETE

**Target:** `lseo scan` with 10 typed SEO rules + AI agent prompt output

All scanner internals are implemented:
- `packages/scanner/src/ast/walker.ts` — `walkFiles()` via fast-glob
- `packages/scanner/src/ast/framework-detector.ts` — `detectFramework()`
- `packages/scanner/src/ast/jsx-parser.ts` — Babel AST → `JsxMetadata`
- `packages/scanner/src/ast/vue-parser.ts` — `@vue/compiler-sfc` → `VueMetadata`
- `packages/core/src/rules/` — 10 rules: `missing-title`, `missing-meta-description`, `missing-h1`, `duplicate-h1`, `missing-alt-text`, `js-only-links`, `hash-routing`, `missing-canonical`, `missing-og-tags`, `missing-structured-data`
- `packages/core/src/engine.ts` — rule registry + `runRules()` + `scanFile()`
- `packages/cli/src/lib/prompt-generator.ts` — `generateSummary()`
- `packages/cli/src/commands/scan.ts` — full pipeline wired up

---

## What To Do Next — Phase 3: URL Scanner

Files: `packages/scanner/src/url/fetcher.ts`, `crawler.ts`, `cheerio-adapter.ts`
Dependencies: `node-fetch`, `cheerio`
Command: `lseo url <url>` — BFS multi-page crawl with PageSpeed Insights option (`--psi`)

---

## Phase 3 — URL Scanner ✅ COMPLETE

**Target:** `lseo url <url>` with live website SEO audit

All URL scanner internals are implemented:
- `packages/scanner/src/url/fetcher.ts` — `fetchPage()`, `extractLinks()`, `extractImages()`, `isUrlReachable()`
- `packages/scanner/src/url/crawler.ts` — `crawlUrl()` BFS multi-page crawl, `discoverSitemap()`, `parseSitemap()`
- `packages/scanner/src/url/cheerio-adapter.ts` — `extractMetadata()`, `runUrlRules()` for URL-based SEO checks
- `packages/core/src/types.ts` — Added URL-specific RuleIds
- `packages/cli/src/commands/url.ts` — Full pipeline wired up with `--depth`, `--limit`, `--sitemap`, `--output` options

**Verified working:** `lseo url https://example.com --depth 0 --limit 1`

---

## Phase 4 — Web Tools Platform

Stack: Next.js 14 App Router · Firebase Hosting · Render backend · NextAuth.js
Location: `apps/web/`
Key: Google OAuth, sandboxed iframe embeds for 9 SEO tools, GSC API proxy

---

## Phase 5 — Landing Page

Hard requirement: **Lighthouse SEO = 100** (CI gate blocks deploy if < 100)

---

## Phase 6 — Launch

- Publish `v1.0.0` to npm
- Deploy Firebase + Render
- Switch `APP_ENV=production` → Supabase adapter
- Write launch posts (dev.to, Hashnode, Product Hunt)
