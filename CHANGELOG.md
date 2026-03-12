# Changelog

All notable changes to `longcelot-seo` are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [0.0.1] — 2026-03-12

### Added
- CLI skeleton: `lseo init`, `lseo scan` (stub), `lseo url` (stub), `lseo open` (stub)
- Sky-blue (`#0EA5E9`) ASCII art install banner
- `lseo.config.js` scaffolding via `lseo init`
- cosmiconfig + Zod config loader
- All 4 output formatters: `prompt`, `json`, `markdown`, `table`
- Shared types package (`@longcelot-seo/core`)
- pnpm monorepo with strict TypeScript, ESLint (`no-explicit-any: error`), Prettier, Husky
- CI workflow (lint + typecheck + test on every PR)
- npm publish workflow (triggered by `v*` git tags)
