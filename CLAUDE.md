# CLAUDE.md — Progress Tracker

> This file tracks what has been implemented and what to do next.
> Updated automatically by Claude Code after each phase.

---

## Phase 1 — CLI SDK Core + Install Banner ✅ COMPLETE

**Completed:** 2026-03-12

### What Was Built

| File / Folder | Description |
|---|---|
| `pnpm-workspace.yaml` | pnpm monorepo workspace linking `packages/*` and `apps/*` |
| `package.json` (root) | Root workspace scripts: `build`, `test`, `lint`, `typecheck`, `format` |
| `tsconfig.json` (root) | Strict TypeScript config (`strict`, `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| `.eslintrc.js` | ESLint with `@typescript-eslint/no-explicit-any: error` enforced |
| `.prettierrc` | Prettier code style config |
| `.gitignore` | Standard Node/Next.js gitignore |
| `LICENSE` | MIT — Copyright Vannseavlong |
| `README.md` | Badges, install instructions, command reference, config docs |
| `CONTRIBUTING.md` | Fork flow, branch naming, commit style, test requirements |
| `CODE_OF_CONDUCT.md` | Contributor Covenant v2.1 |
| `vitest.config.ts` (root) | Root-level Vitest config (coverage thresholds) |
| `.changeset/config.json` | Changesets config for versioning and npm publish |
| `.husky/pre-commit` | Pre-commit hook: `pnpm lint && pnpm typecheck` |
| `.github/workflows/ci.yml` | CI: lint + typecheck + test on every PR/push to main |
| `.github/workflows/publish.yml` | Publish to npm via changesets on main merge |
| `.github/ISSUE_TEMPLATE/bug_report.md` | GitHub bug report template |
| `.github/ISSUE_TEMPLATE/feature_request.md` | GitHub feature request template |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR checklist template |

#### `packages/core`

| File | Description |
|---|---|
| `src/types.ts` | All shared interfaces: `ScanResult`, `RuleViolation`, `LseoConfig`, `IDatabaseAdapter`, `UserContext`, `ScanOptions`, `UrlScanOptions` |
| `src/constants.ts` | `BRAND_COLOR`, `CLI_NAME`, `PACKAGE_NAME`, `DEFAULT_CONFIG`, `SEVERITY_ORDER` |
| `src/index.ts` | Barrel export for the package |
| `src/types.test.ts` | 7 unit tests for constants — all passing |
| `tsup.config.ts` | Builds CJS + ESM + declarations |

#### `packages/cli`

| File | Description |
|---|---|
| `src/bin/lseo.ts` | Commander.js entry point — `lseo --help`, `lseo --version` |
| `src/banner.ts` | Sky-blue (`#0EA5E9`) ASCII art banner via figlet + chalk |
| `src/commands/index.ts` | Registers all subcommands |
| `src/commands/init.ts` | `lseo init` — scaffolds `lseo.config.js` |
| `src/commands/scan.ts` | `lseo scan` — stub with Phase 2 placeholder message |
| `src/commands/url.ts` | `lseo url` — stub with Phase 3 placeholder message |
| `src/commands/open.ts` | `lseo open` — stub with Phase 4 placeholder message |
| `src/lib/config.ts` | cosmiconfig + Zod config loader (`loadConfig()`) |
| `src/lib/output.ts` | All 4 formatters: `formatAsPrompt`, `formatAsJson`, `formatAsMarkdown`, `formatAsTable`, `formatOutput` |
| `src/scripts/postinstall.ts` | Banner printed on global install (builds as CJS) |
| `src/banner.test.ts` | 3 unit tests for banner |
| `src/lib/output.test.ts` | 15 unit tests for all output formatters |
| `tsup.config.ts` | Builds ESM CLI entry + CJS postinstall |

#### `packages/scanner`

| File | Description |
|---|---|
| `src/index.ts` | Stub — re-exports types from `@longcelot-seo/core` |

### Test Results (Phase 1)

```
packages/core   7 tests  — all passing
packages/cli   18 tests  — all passing
packages/scanner  0 tests (stub — passWithNoTests: true)
Total:         25 tests passing
```

### CLI Verification

```sh
node packages/cli/dist/bin/lseo.js --version   # → 0.0.1
node packages/cli/dist/bin/lseo.js --help       # → lists all commands
node packages/cli/dist/bin/lseo.js init         # → scaffolds lseo.config.js
```

---

## What To Do Next — Phase 2: Codebase Scanner

**Target:** `lseo scan` — 10 typed SEO rules + AI agent prompt output

### Files to Create

| File | Description |
|---|---|
| `packages/scanner/src/ast/walker.ts` | Typed file walker — returns `FileInfo[]` using glob with `.gitignore` awareness |
| `packages/scanner/src/ast/framework-detector.ts` | Reads `package.json`, returns `FrameworkType` enum |
| `packages/scanner/src/ast/jsx-parser.ts` | Babel AST → `RuleViolation[]` (handles JSX/TSX) |
| `packages/scanner/src/ast/vue-parser.ts` | `@vue/compiler-sfc` → `RuleViolation[]` (handles `.vue` SFCs) |
| `packages/core/src/rules/missing-title.ts` | Rule: missing `<title>` / `<Head>` / Metadata export |
| `packages/core/src/rules/missing-title.test.ts` | Unit test — ≥1 passing fixture, ≥1 failing fixture |
| `packages/core/src/rules/missing-meta-desc.ts` | Rule: missing meta description |
| `packages/core/src/rules/missing-meta-desc.test.ts` | Unit test |
| `packages/core/src/rules/missing-h1.ts` | Rule: missing or duplicate H1 |
| `packages/core/src/rules/missing-h1.test.ts` | Unit test |
| `packages/core/src/rules/missing-alt-text.ts` | Rule: `<img>` without `alt` |
| `packages/core/src/rules/missing-alt-text.test.ts` | Unit test |
| `packages/core/src/rules/js-only-links.ts` | Rule: JS-only navigation (no `<a href>`) |
| `packages/core/src/rules/js-only-links.test.ts` | Unit test |
| `packages/core/src/rules/hash-routing.ts` | Rule: hash-based routing detected |
| `packages/core/src/rules/hash-routing.test.ts` | Unit test |
| `packages/core/src/rules/missing-canonical.ts` | Rule: missing canonical tag |
| `packages/core/src/rules/missing-canonical.test.ts` | Unit test |
| `packages/core/src/rules/missing-og-tags.ts` | Rule: missing Open Graph tags |
| `packages/core/src/rules/missing-og-tags.test.ts` | Unit test |
| `packages/core/src/rules/missing-structured-data.ts` | Rule: no JSON-LD structured data |
| `packages/core/src/rules/missing-structured-data.test.ts` | Unit test |
| `packages/core/src/engine.ts` | Typed rule runner: `runRules(file, ast) → RuleViolation[]` |
| `packages/cli/src/lib/prompt-generator.ts` | `ScanResult[] → AI prompt string` |
| `packages/cli/__fixtures__/nextjs-app/` | Sample Next.js project for integration tests |
| `packages/scanner/src/ast/scanner.test.ts` | Integration test: scan against `__fixtures__/nextjs-app` |

### Dependencies to Install

```sh
# In packages/scanner:
pnpm add @babel/parser @babel/traverse @babel/types @vue/compiler-sfc fast-glob

# In packages/core:
pnpm add zod  # already in cli, add to core for rule schemas
```

### Command to Implement

Update `packages/cli/src/commands/scan.ts` to:
1. Call `loadConfig()`
2. Call the scanner's `walk()` + `parseAST()` + `runRules()` pipeline
3. Format output via `formatOutput()`
4. Exit code 1 on critical violations if `--ci` flag is set

### CI Gate

All 10 rule unit tests must pass before Phase 2 is considered done.

---

## Phase 3 — URL Scanner (Next after Phase 2)

Files: `packages/scanner/src/url/fetcher.ts`, `crawler.ts`, `cheerio-adapter.ts`
Dependencies: `node-fetch`, `cheerio`
Command: `lseo url <url>` — BFS multi-page crawl with PageSpeed Insights option

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
