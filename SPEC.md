# Longcelot-SEO-Enhancement

> **Full Project Specification & Implementation Roadmap**
> CLI SDK · Web Tools Platform · Landing Page · Open Source

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-vannseavlong%2Flongcelot--seo-181717?logo=github)](https://github.com/vannseavlong/longcelot-seo)
[![npm](https://img.shields.io/badge/npm-longcelot--seo-CB3837?logo=npm)](https://www.npmjs.com/package/longcelot-seo)

---

## Project At a Glance

| Field | Value |
|---|---|
| **Project Name** | `longcelot-seo` |
| **npm Package** | `longcelot-seo` — npm · pnpm · yarn · bun |
| **CLI Command** | `lseo <command>` |
| **GitHub Repo** | https://github.com/vannseavlong/longcelot-seo |
| **License** | MIT — Open Source |
| **Owner / Dev** | Vannseavlong *(sole developer)* |
| **Frontend Host** | Firebase Hosting |
| **Backend Host** | Render |
| **DB — Staging** | `longcelot-sheet-db` — schema-first, actor-based Google Sheets adapter |
| **DB — Production** | Supabase (PostgreSQL) |
| **Status** | Pre-development — v0.1.0 target |
| **CLI Brand Color** | Sky-Blue `#0EA5E9` — printed on install banner |

---

## Table of Contents

1. [Project Overview & Vision](#1-project-overview--vision)
2. [Tech Stack Decisions](#2-tech-stack-decisions)
3. [Development Rules & Code Quality Standards](#3-development-rules--code-quality-standards)
4. [Database Architecture (Dual Environment)](#4-database-architecture-dual-environment)
5. [Repository & Open Source Setup](#5-repository--open-source-setup)
6. [Phase 1 — CLI SDK Core + Install Banner](#phase-1--cli-sdk-core--install-banner)
7. [Phase 2 — Codebase Scanner](#phase-2--codebase-scanner)
8. [Phase 3 — URL / Live Site Scanner](#phase-3--url--live-site-scanner)
9. [Phase 4 — Web Tools Platform](#phase-4--web-tools-platform)
10. [Phase 5 — Landing Page & SEO](#phase-5--landing-page--seo)
11. [Phase 6 — Docs, Release & Community](#phase-6--docs-release--community)
12. [GitHub Repository Structure](#12-github-repository-structure)
13. [Summary Timeline](#13-summary-timeline)

---

## 1. Project Overview & Vision

`longcelot-seo` is a solo-owned, open-source developer toolkit that consolidates the entire SEO improvement workflow into one place. It targets frontend developers and web owners who need to audit, fix, and continuously monitor SEO — from source code analysis all the way to live-site scanning and an aggregated external-tool dashboard.

The project is owned and developed solely by **Vannseavlong**. Community contributions are welcome via pull requests under the MIT license, but all architectural decisions and release approvals rest with the owner.

### 1.1 Core Deliverables

- **`lseo scan`** — Scans your codebase AST and produces an AI-ready prompt listing every SEO issue found
- **`lseo url`** — Audits any live website URL with optional deep multi-page crawl
- **`lseo open`** — Launches the Web Tools dashboard in your default browser
- **Install Banner** — Sky-blue (`#0EA5E9`) ASCII art banner printed on first global install
- **Web Tools Platform** — Next.js dashboard embedding GSC, PageSpeed and other tools with step-by-step guides
- **Landing Page** — Fully SEO-optimised public site *(Lighthouse SEO = 100 is a hard CI requirement)*
- **Open Source GitHub repo** — MIT licensed, CI/CD pipeline, issue/PR templates, contribution guide

> **Solo Ownership Model:** Vannseavlong is the sole developer and decision-maker. The open-source model allows the community to contribute rules, bug fixes, and translations via PR — but the owner merges and maintains the project.

---

## 2. Tech Stack Decisions

Every technology choice is optimised for solo-developer productivity, long-term maintainability, and zero infrastructure cost at small scale.

### 2.1 CLI SDK

*Packages: `packages/cli` · `packages/core` · `packages/scanner`*

| Layer | Technology | Rationale |
|---|---|---|
| Runtime | Node.js 18+ | LTS, ESM-first, supported by npm/pnpm/yarn/bun globally |
| Language | TypeScript *(strict mode)* | Strict types catch bugs early. `no-explicit-any` enforced as CI error |
| CLI Framework | Commander.js | Lightweight, zero-dependency CLI argument parsing |
| HTML Parser | Cheerio + node-fetch | jQuery-style DOM parsing for URL scanner |
| AST Parser | TypeScript Compiler API + @babel/parser | Parses JSX/TSX/Vue SFCs for SEO pattern extraction |
| Vue Parser | @vue/compiler-sfc | Parses `.vue` single-file component templates |
| Config | cosmiconfig | Auto-discovers `lseo.config.js` / `.lseorc` in project root |
| Terminal UI | chalk + cli-table3 + ora + figlet | Coloured output, spinners, tables, sky-blue ASCII banner |
| Output | Custom template engine | Formats violations as structured AI agent prompts |
| Build | tsup | Bundles TS to CJS + ESM. Slim `dist/` for npm publish |
| Testing | Vitest | Fast unit/integration tests. Every rule must have tests. |
| Versioning | `npm version` + git tags | `pnpm release:patch/minor/major` → tag → CI publishes to npm |
| Linting | ESLint + Prettier | `@typescript-eslint` with `no-explicit-any` set to `error` |

### 2.2 Web Platform & Landing Page

*App: `apps/web`*

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 *(App Router)* | SSG landing + SSR dashboard. Ideal for an SEO-focused product. |
| Language | TypeScript *(strict mode)* | Consistent with CLI. No `any`. Zod for runtime validation. |
| Styling | Tailwind CSS | Utility-first. Fast iteration for solo developer. |
| UI Components | shadcn/ui + Radix UI | Accessible headless components with full type safety |
| Tool Embedding | Sandboxed iframes + postMessage | CSP-safe embedding for GSC, PageSpeed, Screaming Frog web |
| Auth | NextAuth.js *(Google OAuth)* | Scopes: GSC read, GA4 read, profile. Session stored in JWT. |
| API Routes | Next.js Route Handlers | Server-side proxy for GSC API, PageSpeed API calls |
| Validation | Zod | Runtime schema validation on all API input/output |
| Testing | Vitest + Playwright | Unit tests for logic; E2E tests for critical user flows |
| Frontend Host | Firebase Hosting | Fast CDN, free SSL, global edge, easy deploy via CLI |
| Backend Host | Render | Auto-deploys from GitHub, free tier for solo project start |
| Docs | Fumadocs *(Next.js MDX)* | Auto-generated docs from MDX files in `/docs` directory |

### 2.3 Database

See [Section 4](#4-database-architecture-dual-environment) for the full dual-environment architecture.

| Environment | Database |
|---|---|
| Staging | `longcelot-sheet-db` — actor-based Google Sheets adapter |
| Production | Supabase *(PostgreSQL with RLS)* |

---

## 3. Development Rules & Code Quality Standards

These rules are **non-negotiable** and apply to all code in the monorepo — CLI, backend, and frontend. They are enforced via ESLint, TypeScript compiler, Husky pre-commit hooks, and CI checks. A PR that violates any rule below will be blocked from merging.

---

### 3.1 TypeScript Rules *(Frontend & Backend)*

> 🚫 **ABSOLUTE: No `any` allowed anywhere.**
> Using `any` defeats the purpose of TypeScript and hides bugs. Use `unknown` and narrow explicitly, or define a proper interface. The ESLint rule `@typescript-eslint/no-explicit-any` is set to `error` — CI will reject the PR.

**`tsconfig.json` must include:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Typing rules:**

- Always define explicit **return types** on exported functions
- Always define **prop types / parameter types** — never rely on inference alone for public APIs
- Use `interface` for object shapes representing domain models (`User`, `ScanResult`, etc.)
- Use `type` for unions, intersections, and utility type aliases
- Use **Zod** for runtime validation at all API boundaries — never trust external data without validation
- Use `unknown` instead of `any` when type is genuinely not known, then narrow with type guards
- Avoid type assertions (`as SomeType`) unless absolutely unavoidable — add a comment explaining why
- Generic types must be constrained (`T extends object`, not bare `T`)

---

### 3.2 Frontend Rules *(Next.js / React)*

- Components must be typed with explicit props interfaces — never use `React.FC` without a generic props type
- No inline styles — use Tailwind utility classes only. CSS variables allowed for theming.
- **Server Components are the default.** Use `'use client'` only when genuinely needed (event handlers, hooks).
- All user-facing pages must export `metadata` (title, description, OG tags) via Next.js Metadata API
- All images must use `next/image` with explicit `width`, `height`, and `alt` props
- All interactive elements must be keyboard-accessible and have `aria-label` when text is absent
- API calls from components go through typed service functions — no raw `fetch()` in JSX files
- Forms must be validated both client-side (`react-hook-form` + Zod) and server-side (Route Handler + Zod)
- No hardcoded strings for UI text — use constants files
- Colours must always use CSS/Tailwind variables — no hardcoded hex values in components

**Component file structure:**

```
/components/ComponentName/
  index.tsx               ← component logic
  ComponentName.types.ts  ← props and types
  ComponentName.test.tsx  ← required test file
```

---

### 3.3 Backend / API Rules *(Route Handlers + Node.js CLI)*

- All Route Handlers must **validate input with Zod** before processing — return `400` with error details on failure
- All Route Handlers must return **typed responses** — define a `ResponseType` interface per endpoint
- Never expose raw database errors to the client — catch, log internally, return a generic error message
- Environment variables must be **validated at startup** via Zod schema — fail fast if misconfigured
- All async functions must have proper error handling — no unhandled promise rejections
- Never commit secrets or API keys — use `.env.local` and `.env.example` with placeholder values
- HTTP status codes must be semantically correct — `200`, `400`, `401`, `500` used appropriately
- All external API calls (GSC, PageSpeed, etc.) must have **timeout configuration and retry logic**

---

### 3.4 Testing Rules *(Mandatory)*

> ✅ **MANDATORY: Every feature must have tests.**
> No PR is merged without corresponding tests. CI blocks merge if coverage drops below **70% line coverage**.

**Requirements by layer:**

| Layer | Requirement |
|---|---|
| CLI Rules (`packages/core/rules/`) | Every SEO rule needs a unit test with ≥1 passing fixture and ≥1 failing fixture |
| CLI Scanner (`packages/scanner/`) | Integration tests running scanner against sample project directories in `__fixtures__/` |
| CLI Prompt Generator | Snapshot tests to catch unintended changes in generated prompt format |
| API Route Handlers | Unit tests mocking Zod validation, DB calls, and external APIs |
| React Components | `@testing-library/react` — render tests + interaction tests for interactive components |
| E2E Flows | Playwright — critical user journeys: install, scan, open dashboard, connect GSC, run URL audit |

**Test file naming convention:**

```
src/rules/missing-title.ts           →  src/rules/missing-title.test.ts
src/components/ToolEmbed/index.tsx   →  src/components/ToolEmbed/ToolEmbed.test.tsx
app/api/scan/route.ts                →  app/api/scan/route.test.ts
```

**Standards:**

| Concern | Standard |
|---|---|
| Unit test framework | Vitest *(CLI and backend)* |
| Component test framework | `@testing-library/react` + Vitest |
| E2E test framework | Playwright |
| Minimum coverage | 70% line coverage *(enforced in CI)* |
| CI gate | All tests must pass before merge to `main` |
| Test data | Fixtures in `__fixtures__/` — never use real user data in tests |

---

### 3.5 Code Style & Review Rules

- ESLint + Prettier enforced via **Husky pre-commit hook** — code that fails lint cannot be committed
- Commit messages follow **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`
- Branch naming: `feature/short-description`, `fix/short-description`, `chore/short-description`
- One logical change per PR — avoid monolithic PRs mixing features, refactors, and bug fixes
- All public functions, classes, and interfaces must have **JSDoc comments**
- Magic numbers and strings must be extracted into named constants
- Functions should do one thing — if > 40 lines, consider splitting
- Use `async/await` consistently — avoid deeply nested callbacks
- Delete dead code rather than commenting it out — git history preserves deleted code

---

## 4. Database Architecture (Dual Environment)

> ⚠️ **HARD ENVIRONMENT BOUNDARY**
> Staging and production databases must **never** share data or credentials. `APP_ENV` is the single source of truth for which adapter loads. Mixing environments will corrupt the admin sheet registry or expose staging data in production.

---

### 4.1 Staging — `longcelot-sheet-db`

`longcelot-sheet-db` is an npm package authored and maintained by Vannseavlong. It is a **schema-first, actor-aware** database adapter that uses Google Sheets as the storage engine — purpose-built for MVPs, prototypes, and staging environments where cost and infrastructure simplicity matter.

| Property | Value |
|---|---|
| **npm package** | `longcelot-sheet-db` |
| **Install** | `npm install longcelot-sheet-db` · `pnpm add longcelot-sheet-db` |
| **CLI init** | `npx sheet-db init` *(creates `sheet-db.config.ts`, `.env`, `schemas/`)* |
| **Auth** | Google OAuth2 (`clientId`, `clientSecret`, `redirectUri`) + bcrypt passwords |
| **Storage engine** | Google Sheets API via `googleapis` |
| **Data model** | Actor-based — each actor role owns its data in its own Google Sheet |
| **Central registry** | Admin Sheet — `users`, `credentials`, `actors`, `permissions` tables |
| **Performance** | Read: ~200–500ms · Write: ~300–700ms · Max: low thousands of rows |
| **Schema tooling** | `sheet-db generate`, `sync`, `validate`, `seed`, `doctor`, `status` |

#### How It Works

Schemas are defined using a TypeScript DSL via `defineTable()`. The `sync` command creates missing sheets and adds missing columns but **never deletes data**. Every operation requires a `context` object specifying the actor — this enforces data isolation automatically.

#### Actors Defined for This Project

| Actor | Sheet Owner | Tables |
|---|---|---|
| `admin` | Vannseavlong's Google account | `users` — registry of all signed-up users<br>`credentials` — hashed passwords & OAuth tokens<br>`actors` — actor definitions<br>`scan_logs` — all CLI scan audit trail<br>`feature_flags` — staging toggles |
| `user` | Each user's own Google account | `scan_history` — their scan results & AI prompts<br>`watchlist_urls` — URLs saved for re-scanning<br>`preferences` — dashboard settings & tool connections |

#### Schema Definition — TypeScript DSL

```typescript
// schemas/user/scan_history.ts
import { defineTable, string, date, json, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'scan_history',
  actor: 'user',
  timestamps: true,
  columns: {
    scan_id:  string().required().unique().primary(),
    type:     string().enum(['codebase', 'url']).required(),
    target:   string().required(),    // file path or URL scanned
    result:   json(),                 // RuleViolation[] serialised
    prompt:   string(),               // generated AI prompt text
    status:   string().enum(['pass', 'fail', 'error']).default('fail'),
  },
});
```

```typescript
// schemas/admin/scan_logs.ts
export default defineTable({
  name: 'scan_logs',
  actor: 'admin',
  timestamps: true,
  columns: {
    log_id:      string().required().unique().primary(),
    user_id:     string().required().ref('users.id'),
    scan_type:   string().enum(['codebase', 'url']).required(),
    target:      string().required(),
    issue_count: number().min(0).default(0),
  },
});
```

#### Staging Adapter Integration

```typescript
// packages/core/db/staging-adapter.ts
import { createSheetAdapter } from 'longcelot-sheet-db';
import type { IDatabaseAdapter, UserContext } from '../types';
import scanHistorySchema from '../../schemas/user/scan_history';
import scanLogsSchema   from '../../schemas/admin/scan_logs';

export class StagingAdapter implements IDatabaseAdapter {
  private adapter = createSheetAdapter({
    adminSheetId: process.env.ADMIN_SHEET_ID!,
    credentials: {
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri:  process.env.GOOGLE_REDIRECT_URI!,
    },
    tokens: null, // injected per-request via withUserContext()
  });

  constructor() {
    this.adapter.registerSchema(scanHistorySchema);
    this.adapter.registerSchema(scanLogsSchema);
  }

  withUserContext(ctx: UserContext) {
    return this.adapter.withContext({
      userId:       ctx.userId,
      role:         'user',
      actorSheetId: ctx.actorSheetId, // user's own Google Sheet ID
    });
  }
}
```

#### Staging Setup Sequence

Follow this exact order when setting up staging for the first time:

| # | Step | Command / Action |
|---|---|---|
| 1 | Install package | `pnpm add longcelot-sheet-db` in `packages/core` |
| 2 | Run init | `npx sheet-db init` → creates `sheet-db.config.ts`, `.env`, `schemas/` |
| 3 | Set OAuth credentials | Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` to `.env` |
| 4 | Set `ADMIN_SHEET_ID` | Create a blank Google Sheet and paste its ID into `.env` |
| 5 | Define schemas | Write `schemas/admin/*.ts` and `schemas/user/*.ts` using `defineTable()` |
| 6 | Validate schemas | `npx sheet-db validate` — checks for errors before syncing |
| 7 | Sync to Sheets | `npx sheet-db sync` — creates all tables as sheet tabs |
| 8 | Verify | `npx sheet-db status` — shows all registered tables and sheet IDs |
| 9 | Seed test data | `npx sheet-db seed` — loads fixture data for development |
| 10 | Health check | `npx sheet-db doctor` — validates environment & config |

> ⚡ **Performance Note:** Suitable for hundreds to low thousands of rows. Read ~200–500ms, write ~300–700ms. Do not use for load testing or high-concurrency scenarios.

---

### 4.2 Production — Supabase

Supabase provides a hosted PostgreSQL database with row-level security (RLS), built-in auth, and a fully typed TypeScript SDK. It is the production database for real users at scale.

| Property | Value |
|---|---|
| **Service** | Supabase *(hosted PostgreSQL)* |
| **Auth** | Supabase Auth with Google OAuth provider |
| **RLS** | Row Level Security on every table — `auth.uid() = user_id` enforced |
| **SDK** | `@supabase/supabase-js` with generated types via `supabase gen types` |
| **Migrations** | Supabase CLI — `supabase migration new`, `supabase db push` |
| **Env vars** | `SUPABASE_URL`, `SUPABASE_ANON_KEY` *(client)*, `SUPABASE_SERVICE_KEY` *(server only)* |

#### Production Schema

*Schema mirrors staging actor tables — intentional for easy migration.*

| Table | Columns | Staging Equivalent |
|---|---|---|
| `users` | `id`, `email`, `google_id`, `actor_sheet_id`, `created_at` | `admin.users` |
| `credentials` | `id`, `user_id FK`, `password_hash`, `google_tokens_enc`, `updated_at` | `admin.credentials` |
| `scan_history` | `id`, `user_id FK`, `type`, `target`, `result jsonb`, `prompt`, `status`, `created_at` | `user.scan_history` |
| `watchlist_urls` | `id`, `user_id FK`, `url`, `last_scanned_at`, `issue_count`, `created_at` | `user.watchlist_urls` |
| `preferences` | `id`, `user_id FK`, `settings jsonb`, `updated_at` | `user.preferences` |
| `scan_logs` | `id`, `user_id FK`, `scan_type`, `target`, `issue_count`, `created_at` | `admin.scan_logs` |
| `feature_flags` | `key PK`, `value`, `environment`, `updated_at` | `admin.feature_flags` |

> 🔒 **RLS Required on Every Table:** Policy: `auth.uid() = user_id` for `SELECT/INSERT/UPDATE/DELETE`. The `SUPABASE_SERVICE_KEY` bypasses RLS for admin server ops — it must **never** be set as `NEXT_PUBLIC_*` or sent to the browser.

#### Production Adapter

```typescript
// packages/core/db/production-adapter.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase'; // generated by supabase gen types
import type { IDatabaseAdapter, UserContext } from '../types';

export class ProductionAdapter implements IDatabaseAdapter {
  // Server-side: service key, bypasses RLS for admin operations
  private adminClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // server only — NEVER send to client
  );

  // User-scoped: anon key + user JWT, RLS enforced
  withUserContext(ctx: UserContext) {
    return createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${ctx.accessToken}` } } }
    );
  }
}
```

---

### 4.3 Shared Adapter Interface

Both adapters implement the same `IDatabaseAdapter` interface. Application code **always** imports from `packages/core/db/index.ts` — never directly from `longcelot-sheet-db` or `@supabase/supabase-js`.

```typescript
// packages/core/db/index.ts — THE ONLY DATABASE IMPORT POINT
import { StagingAdapter }    from './staging-adapter';
import { ProductionAdapter } from './production-adapter';
import type { IDatabaseAdapter } from '../types';

// APP_ENV is the single switch: 'staging' | 'production'
export const db: IDatabaseAdapter =
  process.env.APP_ENV === 'production'
    ? new ProductionAdapter()
    : new StagingAdapter();
```

| `APP_ENV` | Effect |
|---|---|
| `staging` *(local `.env.local`)* | `StagingAdapter` → `longcelot-sheet-db` → Google Sheets |
| `staging` *(GitHub Actions CI)* | Tests run against staging DB |
| `staging` *(Render staging service)* | Real staging environment |
| `production` *(Render production)* | `ProductionAdapter` → Supabase → PostgreSQL |

> ✅ **Migration Path:** Every `defineTable()` schema maps directly to a SQL table. When ready for production: create Supabase tables mirroring the schema, set `APP_ENV=production`. No application logic changes needed.

---

### 4.4 Conflicts to Avoid

| # | ❌ Never Do This | ✅ Do This Instead |
|---|---|---|
| 1 | Import `longcelot-sheet-db` directly in app code | Always import from `packages/core/db/index.ts` |
| 2 | Import `@supabase/supabase-js` directly in app code | Always import from `packages/core/db/index.ts` |
| 3 | Use `SUPABASE_SERVICE_KEY` on the client / in browser | Service key in server Route Handlers only — never `NEXT_PUBLIC_*` |
| 4 | Use the same `.env` file for staging and production | Separate `.env.staging` and `.env.production` — never mix |
| 5 | Run `npx sheet-db sync` against production Supabase | `sheet-db` CLI is for staging only — use `supabase CLI` for prod |
| 6 | Store real user data in the staging admin Google Sheet | Staging is for test data only — never onboard real users to staging |
| 7 | Set `APP_ENV=production` in local `.env.local` | Local development always uses `APP_ENV=staging` |
| 8 | Use production Google OAuth credentials for staging | Use a dedicated staging Google OAuth app — separate credentials |

---

## 5. Repository & Open Source Setup

Repository: **https://github.com/vannseavlong/longcelot-seo**

| # | Task | Priority | Effort | Notes |
|---|---|---|---|---|
| 1 | Repository already created | Critical | Done | Public, MIT |
| 2 | Add MIT LICENSE with owner name | Critical | 5 min | `Copyright (c) Vannseavlong` |
| 3 | Configure pnpm workspaces monorepo | Critical | 1 hr | `pnpm-workspace.yaml` linking all packages |
| 4 | Write root `README.md` | Critical | 2 hrs | Badges, install, quickstart, command reference |
| 5 | Add `CONTRIBUTING.md` | High | 1 hr | Fork flow, branch naming, commit style, test requirements |
| 6 | Add `CODE_OF_CONDUCT.md` | High | 15 min | Contributor Covenant v2.1 |
| 7 | GitHub Actions: CI workflow | Critical | 2 hrs | Lint + type-check + test on every PR. Uses `NPM_TOKEN` secret. |
| 8 | GitHub Actions: publish workflow | High | 2 hrs | Auto-publish to npm on `v*` git tag push |
| 9 | Add `NPM_TOKEN` as GitHub repository secret | Critical | 10 min | Settings → Secrets → Actions → `NPM_TOKEN` |
| 10 | Set branch protection on `main` | High | 10 min | Require passing CI checks before merge |
| 11 | Add GitHub issue templates | Medium | 30 min | Bug report + Feature request |
| 12 | Add PR template | Medium | 20 min | Checklist: tests added, types correct, docs updated |

### CI/CD Secrets Reference

| Secret / Env Var | Purpose |
|---|---|
| `NPM_TOKEN` | Granular npm access token. Used by CI for automated `npm publish` on release. |
| `SUPABASE_URL` | Production Supabase project URL. Set in Render and Firebase env config. |
| `SUPABASE_SERVICE_KEY` | Supabase service role key — server only, never exposed to client. |
| `GOOGLE_CLIENT_ID` | OAuth client ID for both `longcelot-sheet-db` (staging) and NextAuth (web platform). |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret — keep separate apps for staging vs production. |
| `GOOGLE_REDIRECT_URI` | OAuth redirect URI — must match Google Console app config exactly. |
| `ADMIN_SHEET_ID` | Google Sheet ID for the `admin` actor central registry (staging only). |
| `NEXTAUTH_SECRET` | Random secret for NextAuth.js session encryption. |
| `NEXTAUTH_URL` | Public URL of the web platform (Firebase Hosting URL for prod). |
| `APP_ENV` | `staging` or `production` — controls which DB adapter loads. |

---

## Phase 1 — CLI SDK Core + Install Banner

**Duration:** Week 1
**Deliverable:** Publishable CLI skeleton on npm, with sky-blue banner on install
**CI Gate:** `npm install -g longcelot-seo` works on npm / pnpm / yarn / bun

### Install Banner

When the package is installed globally (via `postinstall` hook) or when `lseo` is first run, a sky-blue ASCII art banner is printed:

```
  ██╗      ███████╗███████╗ ██████╗
  ██║      ██╔════╝██╔════╝██╔═══██╗
  ██║      ███████╗█████╗  ██║   ██║
  ██║      ╚════██║██╔══╝  ██║   ██║
  ███████╗ ███████║███████╗╚██████╔╝

  LONGCELOT-SEO TOOLKIT  v1.0.0
  The SEO engineer's best friend.
```

*All text rendered in `chalk.hex('#0EA5E9')`. Uses `figlet` for ASCII art generation.*

### Tasks

| # | Task | Priority | Effort | Notes |
|---|---|---|---|---|
| 1 | Initialise `packages/cli` with tsup + TypeScript strict mode | Critical | 2 hrs | `strict: true`, `noImplicitAny: true` |
| 2 | Set up `packages/core` for shared types + DB adapter | Critical | 1 hr | `ScanResult`, `RuleViolation` interfaces — no `any` |
| 3 | Wire Commander.js entry point | Critical | 1 hr | `bin/lseo.ts` → `commands/index.ts` |
| 4 | Build sky-blue install banner with figlet + chalk | Critical | 2 hrs | `chalk.hex('#0EA5E9')` — postinstall script |
| 5 | Implement `lseo --help` and `lseo --version` | Critical | 30 min | Version pulled from `package.json` automatically |
| 6 | Implement `lseo init` command | High | 2 hrs | Scaffolds `lseo.config.js` in project root |
| 7 | Write cosmiconfig loader for `lseo.config.js` | High | 1 hr | Loads config, merges with CLI flags, validates with Zod |
| 8 | Add ESLint + Prettier + Husky pre-commit | Critical | 1 hr | `@typescript-eslint/no-explicit-any: error` |
| 9 | Write smoke tests (Vitest) | High | 1 hr | Test `--version`, banner output, config loading |
| 10 | Configure release scripts + git tag publish | High | 1 hr | `pnpm release:patch/minor/major` → `git push --follow-tags` |
| 11 | Publish `v0.0.1-alpha` to npm via CI | Critical | 1 hr | CI uses `NPM_TOKEN` secret |

### `lseo.config.js` Schema

```js
// lseo.config.js
module.exports = {
  scan: {
    include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
    exclude: ['node_modules', 'dist', '.next'],
    framework: 'auto', // 'nextjs' | 'nuxt' | 'vue' | 'react'
  },
  url: {
    timeout: 15000,
    followRedirects: true,
    delay: 300, // ms between requests during crawl
    userAgent: 'longcelot-seo-bot/1.0',
  },
  output: {
    format: 'prompt', // 'prompt' | 'json' | 'markdown' | 'table'
    outputFile: null, // null = stdout, or path to write file
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
};
```

---

## Phase 2 — Codebase Scanner

**Duration:** Weeks 2–3
**Deliverable:** `lseo scan` with 13 typed rules + AI agent prompt output
**CI Gate:** All rule unit tests pass in Vitest

### How It Works

The scanner walks source files, applies SEO rules via AST parsing (Babel for JSX/TSX, `@vue/compiler-sfc` for Vue), and outputs a structured prompt that can be pasted into any AI agent to automatically fix every detected issue.

**Example output:**
```
You are an expert SEO engineer reviewing a Next.js codebase.
Fix every issue below. Show the exact file edit for each.

[CRITICAL] src/app/page.tsx — Missing <title> in Metadata export
[HIGH]     src/components/Hero.tsx line 24 — <img> missing alt attribute
[HIGH]     src/app/blog/page.tsx — No H1 found in rendered output
[MEDIUM]   src/app/layout.tsx — og:image Open Graph tag absent
```

### Command Flags

```
lseo scan [options]

  --dir <path>          Root directory to scan (default: cwd)
  --framework <name>    Override detection: nextjs | nuxt | vue | react
  --output <format>     prompt | json | markdown | table  (default: prompt)
  --file <path>         Write output to file instead of stdout
  --rules <list>        Comma-separated list of rules to run
  --verbose             Show all files scanned, not just violations
  --ci                  Exit code 1 if any critical violations found
```

### Tasks

| # | Task | Priority | Effort | Notes |
|---|---|---|---|---|
| 1 | Build file walker with glob + `.gitignore` awareness | Critical | 3 hrs | Returns typed `FileInfo[]` |
| 2 | Framework auto-detection | High | 2 hrs | Reads `package.json`, returns `FrameworkType` enum |
| 3 | JSX/TSX AST rule engine (Babel parser) | Critical | 8 hrs | Adapter: `ASTNode → RuleViolation[]` |
| 4 | Vue SFC template parser adapter | Critical | 6 hrs | `@vue/compiler-sfc → RuleViolation[]` |
| 5 | Rule: missing `<title>` / `<Head>` / Metadata | Critical | 3 hrs | Tests required |
| 6 | Rule: missing meta description | Critical | 2 hrs | Tests required |
| 7 | Rule: missing or duplicate H1 | Critical | 2 hrs | Tests required |
| 8 | Rule: images missing alt text | High | 2 hrs | Tests required |
| 9 | Rule: JS-only navigation (no `<a href>`) | High | 3 hrs | Tests required |
| 10 | Rule: hash routing detection | High | 2 hrs | Tests required |
| 11 | Rule: missing canonical tag | High | 2 hrs | Tests required |
| 12 | Rule: missing Open Graph tags | Medium | 2 hrs | Tests required |
| 13 | Rule: missing JSON-LD structured data | Medium | 2 hrs | Tests required |
| 14 | Build prompt generator module | Critical | 4 hrs | `ScanResult[] → string` — snapshot tests |
| 15 | JSON / Markdown / table formatters | High | 3 hrs | Alternative outputs for CI pipelines |
| 16 | `--ci` flag (exit 1 on critical violations) | High | 1 hr | GitHub Actions SEO regression gate |
| 17 | Integration test: scan Next.js fixture project | High | 2 hrs | Fixture in `__fixtures__/nextjs-app` |

---

## Phase 3 — URL / Live Site Scanner

**Duration:** Weeks 4–5
**Deliverable:** `lseo url` with typed multi-page crawl
**CI Gate:** Local fixture server integration tests pass

### Command Flags

```
lseo url <url> [options]

  --depth <n>           Crawl linked pages up to depth n (default: 1)
  --limit <n>           Max pages to crawl (default: 50)
  --output <format>     prompt | json | markdown | table
  --file <path>         Write results to file
  --psi                 Run PageSpeed Insights API on each URL
  --compare <url>       Compare two URLs side-by-side
  --sitemap             Auto-discover URLs from sitemap.xml
  --user-agent <string> Custom user agent string
```

### Tasks

| # | Task | Priority | Effort | Notes |
|---|---|---|---|---|
| 1 | Typed HTTP fetcher (node-fetch + redirect follow) | Critical | 2 hrs | Returns `FetchResult: { html, status, finalUrl, headers }` |
| 2 | Cheerio DOM adapter (typed, same rule interface) | Critical | 4 hrs | `CheerioAdapter implements RuleEngine` |
| 3 | Single-page URL scan end-to-end | Critical | 3 hrs | fetch → parse → rules → prompt |
| 4 | BFS multi-page crawler | High | 6 hrs | `CrawlResult: { pages: PageResult[], errors: CrawlError[] }` |
| 5 | `sitemap.xml` auto-discovery | High | 3 hrs | Parses `SitemapEntry[]` with `loc`, `lastmod`, `priority` |
| 6 | robots.txt compliance check | High | 2 hrs | Warn when Disallow rules block scan |
| 7 | HTTP status checks (4xx, 5xx, redirect chains) | High | 2 hrs | Included in `PageResult.statusCode` |
| 8 | PageSpeed Insights API integration (`--psi`) | Medium | 4 hrs | Returns `CWVResult: { lcp, cls, inp, fcp }` |
| 9 | URL comparison mode (`--compare`) | Medium | 4 hrs | `CompareResult: { a, b, diff: Diff[] }` |
| 10 | Polite crawl delay (300ms default) | High | 1 hr | Configurable via `lseo.config.js url.delay` |
| 11 | Integration tests with local fixture HTML server | High | 3 hrs | Vitest + local HTTP server — no real site calls in tests |

---

## Phase 4 — Web Tools Platform

**Duration:** Weeks 6–8
**Deliverable:** Firebase + Render deployed tools dashboard
**CI Gate:** Playwright E2E critical flows pass

The web platform is a Next.js 14 application deployed to **Firebase Hosting** (frontend) and **Render** (backend/API). It embeds 9 SEO tools in sandboxed iframes alongside step-by-step contextual guides. Users authenticate via Google OAuth to connect GSC and GA4.

> 🔥 **Hosting Split:** Firebase Hosting for HTML/CSS/JS (fast CDN, free SSL), Render for persistent Node.js backend / API route processing.

### `lseo open` Command

```
lseo open [options]

  lseo open                Opens the web dashboard in default browser
  lseo open --tool gsc     Opens directly to Google Search Console tab
  lseo open --tool psi     Opens directly to PageSpeed Insights tab
  lseo open --tool sf      Opens directly to Screaming Frog tab
  lseo open --url <url>    Pre-fills the URL input in the dashboard
```

### Feature Tasks

| # | Task | Priority | Effort | Notes |
|---|---|---|---|---|
| 1 | Next.js 14 App Router setup — TypeScript strict | Critical | 3 hrs | No `any` in route handlers or components |
| 2 | Firebase Hosting deploy pipeline | Critical | 2 hrs | `firebase.json` + GitHub Actions on `main` merge |
| 3 | Render backend deploy pipeline | Critical | 2 hrs | `render.yaml` + GitHub Actions trigger |
| 4 | Google OAuth via NextAuth.js *(typed session)* | Critical | 4 hrs | `Session: { user: User; googleToken: string }` — Zod validated |
| 5 | Sandboxed iframe embed system | Critical | 4 hrs | CSP headers + `sandbox` attributes per tool |
| 6 | `GuideSidebar` component with MDX content | Critical | 6 hrs | Props: `{ tool: ToolSlug; step: number }` — fully typed |
| 7 | Tool nav sidebar with deep linking | High | 3 hrs | `/tools/[tool]` — `ToolSlug` union type |
| 8 | URL input bar with Zod validation | High | 2 hrs | Validates URL format before sending to embedded tool |
| 9 | GSC API proxy Route Handler | High | 6 hrs | `GET /api/gsc/performance → GscResponse` Zod schema |
| 10 | PageSpeed Insights API *(server-side)* | High | 4 hrs | `GET /api/psi?url=... → CwvResult` type |
| 11 | Scan history persistence via DB adapter | Medium | 5 hrs | `POST /api/scans` — SheetDB staging / Supabase prod |
| 12 | Tool auth status indicators | Medium | 2 hrs | `ToolStatus: 'connected' \| 'disconnected' \| 'error'` |
| 13 | Component unit tests | High | 4 hrs | `GuideSidebar`, `ToolEmbed`, `UrlInput` — each has test file |
| 14 | Playwright E2E: connect GSC + run URL scan | High | 4 hrs | Critical user journey — must pass in CI |

### Embedded Tools

| Tool | Details |
|---|---|
| Google Search Console | `search.google.com/search-console` — Google OAuth required. Primary tool. |
| PageSpeed Insights | `pagespeed.web.dev` — No auth. URL pre-filled from input bar. |
| Google Rich Results Test | `search.google.com/test/rich-results` — URL passthrough |
| Screaming Frog *(web)* | `screamingfrog.co.uk` — Links to desktop app with setup guide |
| Ahrefs Webmaster Tools | `ahrefs.com/webmaster-tools` — Free tier. Account required. |
| Bing Webmaster Tools | `bing.com/webmasters` — Microsoft account required. |
| Google Analytics GA4 | `analytics.google.com` — Same Google OAuth as GSC |
| Schema Markup Validator | `validator.schema.org` — URL or paste mode. No auth. |
| Robots.txt Tester | `search.google.com/search-console/robots-testing-tool` |

---

## Phase 5 — Landing Page & SEO

**Duration:** Week 9
**Deliverable:** Lighthouse SEO = 100 on production URL
**CI Gate:** Lighthouse CI blocks deploy if SEO score < 100 or any CWV metric is red

> 💯 **MANDATORY: Lighthouse SEO = 100**
> The landing page is a showcase of perfect SEO. If the SEO toolkit's own site doesn't achieve a perfect score, no one will trust the tool. This is a **hard CI gate** — the deploy pipeline runs Lighthouse CI and blocks deployment if the score drops below 100.

### SEO Requirements (All Mandatory)

| # | Requirement | Priority |
|---|---|---|
| 1 | Unique `<title>` for every public page (50–60 chars, keyword near front) | Critical |
| 2 | Unique `<meta description>` for every page (120–158 chars) | Critical |
| 3 | Open Graph tags: `og:title`, `og:description`, `og:image` (1200×630px), `og:url` | Critical |
| 4 | Twitter Card meta tags | High |
| 5 | JSON-LD: `SoftwareApplication` schema on homepage | High |
| 6 | JSON-LD: `BreadcrumbList` on all interior pages | High |
| 7 | Single H1 per page, correct heading hierarchy (H1 → H2 → H3) | Critical |
| 8 | Semantic HTML: `<main>`, `<article>`, `<nav>`, `<section>` throughout | Critical |
| 9 | All images: `next/image` with `alt`, `width`, `height` — WebP/AVIF format | Critical |
| 10 | Every page reachable within 2 clicks from homepage | High |
| 11 | XML sitemap generated via `next-sitemap` and linked in `robots.txt` | Critical |
| 12 | `robots.txt` blocks `/api/` and `/tools/` (auth-gated) from crawling | Critical |
| 13 | Canonical tags on all pages (self-referencing) | Critical |
| 14 | Font preloaded with `font-display: swap` | High |
| 15 | LCP < 2.5s · CLS < 0.1 · INP < 200ms | Critical |
| 16 | Lighthouse CI gate in deploy pipeline (`lhci autorun`) | Critical |

### Landing Page Sections

| # | Section | Priority | Effort |
|---|---|---|---|
| 1 | Hero — headline, `npm install` copy block (npm/pnpm/yarn/bun tabs), CTA | Critical | 4 hrs |
| 2 | How it works — 3-step: Install → Scan → Fix | Critical | 3 hrs |
| 3 | Animated terminal demo — `lseo scan` output with sky-blue banner | High | 4 hrs |
| 4 | Features grid — CLI scan, URL scan, web tools, open source | High | 2 hrs |
| 5 | Framework compatibility badges — React / Next.js / Vue / Nuxt | Medium | 1 hr |
| 6 | GitHub live star count — GitHub API, 1hr ISR cache | Medium | 2 hrs |
| 7 | Footer — docs, GitHub, npm, license, contributing | High | 1 hr |

---

## Phase 6 — Docs, Release & Community

**Duration:** Week 10
**Deliverable:** v1.0.0 on npm, deployed to production, announced publicly
**CI Gate:** All workflows green, Lighthouse SEO = 100 confirmed on live domain

| # | Task | Priority | Effort | Notes |
|---|---|---|---|---|
| 1 | Publish `v1.0.0` to npm via CI | Critical | 2 hrs | `pnpm release:major` → `git push --follow-tags` → `NPM_TOKEN` publish |
| 2 | Deploy web to Firebase Hosting | Critical | 2 hrs | `firebase deploy` — set prod env vars |
| 3 | Deploy backend to Render | Critical | 2 hrs | Push to `main` triggers auto-deploy |
| 4 | Switch `APP_ENV=production` | Critical | 30 min | Activates Supabase adapter |
| 5 | Deploy Fumadocs docs site | Critical | 1 hr | Subdomain on Firebase Hosting |
| 6 | Final Lighthouse CI pass on live domain | Critical | 1 hr | Must confirm SEO = 100 on production URL |
| 7 | Write launch post for dev.to / Hashnode | High | 4 hrs | Technical: how the AST scanner works |
| 8 | Post to Product Hunt | High | 3 hrs | Gallery, tagline, maker first comment |
| 9 | Submit to awesome-seo + awesome-nodejs | Medium | 1 hr | Organic discovery via GitHub |
| 10 | Create v1.1.0 roadmap on GitHub Projects | Medium | 2 hrs | Plugin API, more framework rules, i18n |

---

## 12. GitHub Repository Structure

```
longcelot-seo/                              # github.com/vannseavlong/longcelot-seo
│
├── packages/
│   ├── cli/
│   │   ├── src/
│   │   │   ├── bin/lseo.ts                 # Entry point — shows sky-blue banner
│   │   │   ├── banner.ts                   # figlet + chalk.hex('#0EA5E9')
│   │   │   ├── commands/
│   │   │   │   ├── scan.ts                 # lseo scan
│   │   │   │   ├── url.ts                  # lseo url
│   │   │   │   ├── open.ts                 # lseo open
│   │   │   │   └── init.ts                 # lseo init
│   │   │   └── lib/
│   │   │       ├── config.ts               # cosmiconfig + Zod validation
│   │   │       ├── output.ts               # prompt/json/md/table formatters
│   │   │       └── prompt-generator.ts     # AI agent prompt builder
│   │   ├── __fixtures__/                   # Test fixture projects (no real data)
│   │   ├── package.json
│   │   └── tsconfig.json                   # strict: true, noImplicitAny: true
│   │
│   ├── core/
│   │   ├── src/
│   │   │   ├── types.ts                    # ScanResult, RuleViolation (no any)
│   │   │   ├── rules/                      # One .ts + one .test.ts per rule
│   │   │   │   ├── missing-title.ts
│   │   │   │   ├── missing-title.test.ts
│   │   │   │   ├── missing-meta-desc.ts
│   │   │   │   ├── missing-meta-desc.test.ts
│   │   │   │   └── ...                     # all 13 rules follow same pattern
│   │   │   ├── engine.ts                   # Typed rule runner
│   │   │   └── db/
│   │   │       ├── index.ts                # THE ONLY DB IMPORT POINT
│   │   │       ├── staging-adapter.ts      # longcelot-sheet-db wrapper
│   │   │       └── production-adapter.ts   # Supabase wrapper
│   │   └── schemas/
│   │       ├── admin/
│   │       │   ├── scan_logs.ts
│   │       │   └── feature_flags.ts
│   │       └── user/
│   │           ├── scan_history.ts
│   │           ├── watchlist_urls.ts
│   │           └── preferences.ts
│   │
│   └── scanner/
│       └── src/
│           ├── ast/
│           │   ├── walker.ts               # Typed file walker
│           │   ├── jsx-parser.ts           # Babel AST → RuleViolation[]
│           │   └── vue-parser.ts           # @vue/compiler-sfc → RuleViolation[]
│           └── url/
│               ├── fetcher.ts              # Typed HTTP fetch
│               ├── crawler.ts              # BFS multi-page crawler
│               └── cheerio-adapter.ts      # Cheerio DOM → rule engine
│
├── apps/
│   ├── web/                                # Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── (landing)/                  # Public marketing pages
│   │   │   ├── (platform)/                 # Auth-gated tools dashboard
│   │   │   │   └── tools/[tool]/           # Dynamic tool embed route
│   │   │   └── api/
│   │   │       ├── gsc/route.ts            # GSC API proxy
│   │   │       ├── psi/route.ts            # PageSpeed API proxy
│   │   │       └── scans/route.ts          # Scan history CRUD
│   │   ├── components/
│   │   │   ├── ToolEmbed/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── ToolEmbed.types.ts
│   │   │   │   └── ToolEmbed.test.tsx      # Required
│   │   │   └── GuideSidebar/
│   │   │       ├── index.tsx
│   │   │       ├── GuideSidebar.types.ts
│   │   │       └── GuideSidebar.test.tsx   # Required
│   │   ├── content/guides/                 # MDX step-by-step guides per tool
│   │   └── firebase.json                   # Firebase Hosting config
│   │
│   └── docs/                               # Fumadocs documentation site
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                          # Lint + type-check + test + Lighthouse CI
│   │   ├── publish.yml                     # npm publish (NPM_TOKEN secret)
│   │   ├── deploy-firebase.yml             # Firebase Hosting deploy
│   │   └── deploy-render.yml               # Render backend deploy
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .husky/
│   └── pre-commit                          # ESLint + type-check gate
│
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE                                 # MIT — Copyright Vannseavlong
├── README.md
└── pnpm-workspace.yaml
```

---

## 13. Summary Timeline

| Phase | Duration | Deliverable | CI Gate |
|---|---|---|---|
| Phase 1 — CLI Core | Week 1 | Publishable CLI with sky-blue banner on npm | `npm install -g longcelot-seo` works on all package managers |
| Phase 2 — Code Scanner | Weeks 2–3 | `lseo scan` with 13 typed rules + prompt output | All rule tests pass in Vitest |
| Phase 3 — URL Scanner | Weeks 4–5 | `lseo url` with typed multi-page crawl | Local fixture server integration tests pass |
| Phase 4 — Web Platform | Weeks 6–8 | Firebase + Render deployed tools dashboard | Playwright E2E critical flows pass |
| Phase 5 — Landing Page | Week 9 | Lighthouse SEO = 100 on production URL | Lighthouse CI blocks deploy if score < 100 |
| Phase 6 — Launch | Week 10 | v1.0.0 on npm, PH posted, docs live | All CI workflows green, site live |

> **Total Estimate:** ~10 weeks solo development. CLI phases (1–3) and Web Platform scaffold (Phase 4) can run in parallel from Week 3 onwards. Database setup runs alongside Phase 1.

---

*Longcelot-SEO-Enhancement · MIT License · Owner: Vannseavlong · [github.com/vannseavlong/longcelot-seo](https://github.com/vannseavlong/longcelot-seo)*
