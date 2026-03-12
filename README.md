# longcelot-seo

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/badge/npm-longcelot--seo-CB3837?logo=npm)](https://www.npmjs.com/package/longcelot-seo)
[![GitHub](https://img.shields.io/badge/GitHub-vannseavlong%2Flongcelot--seo-181717?logo=github)](https://github.com/vannseavlong/longcelot-seo)

**The SEO engineer's best friend.** A CLI toolkit that consolidates the entire SEO workflow — from source code analysis to live-site scanning and an aggregated tools dashboard.

---

## Install

```sh
npm install -g longcelot-seo
# or
pnpm add -g longcelot-seo
# or
yarn global add longcelot-seo
# or
bun add -g longcelot-seo
```

---

## Commands

| Command | Description |
|---|---|
| `lseo init` | Scaffold `lseo.config.js` in your project |
| `lseo scan` | Scan your codebase for SEO issues (Phase 2) |
| `lseo url <url>` | Audit a live site URL (Phase 3) |
| `lseo open` | Launch the Web Tools dashboard (Phase 4) |

### `lseo init`

```sh
lseo init
```

Creates `lseo.config.js` in the current directory with sensible defaults.

### `lseo scan` *(coming Phase 2)*

```sh
lseo scan --dir ./src --output prompt
lseo scan --framework nextjs --ci
```

Walks your source files, applies 10 typed SEO rules, and outputs an AI-ready prompt listing every issue.

**Flags:**

| Flag | Default | Description |
|---|---|---|
| `--dir <path>` | `cwd` | Root directory to scan |
| `--framework <name>` | auto-detect | `nextjs` \| `nuxt` \| `vue` \| `react` |
| `--output <format>` | `prompt` | `prompt` \| `json` \| `markdown` \| `table` |
| `--file <path>` | stdout | Write output to file |
| `--rules <list>` | all | Comma-separated rule IDs |
| `--verbose` | off | Show all files, not just violations |
| `--ci` | off | Exit 1 if any critical violations |

### `lseo url <url>` *(coming Phase 3)*

```sh
lseo url https://example.com --depth 2 --psi
```

Audits live pages via Cheerio DOM parsing, optional PageSpeed Insights integration, and BFS multi-page crawling.

### `lseo open` *(coming Phase 4)*

```sh
lseo open
lseo open --tool gsc
```

Launches the Web Tools dashboard (Firebase Hosting) in your browser.

---

## Configuration

Create `lseo.config.js` at your project root (or run `lseo init`):

```js
module.exports = {
  scan: {
    include: ['src/**/*.{js,jsx,ts,tsx,vue}'],
    exclude: ['node_modules', 'dist', '.next'],
    framework: 'auto',
  },
  url: {
    timeout: 15000,
    followRedirects: true,
    delay: 300,
    userAgent: 'longcelot-seo-bot/1.0',
  },
  output: {
    format: 'prompt',
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
};
```

---

## SEO Rules

| Rule ID | Severity | Description |
|---|---|---|
| `missing-title` | Critical | Missing `<title>` / Metadata export |
| `missing-meta-description` | Critical | Missing meta description |
| `missing-h1` | Critical | No H1 found on the page |
| `duplicate-h1` | High | More than one H1 per page |
| `missing-alt-text` | High | `<img>` without `alt` attribute |
| `js-only-links` | High | Navigation without `<a href>` (JS-only) |
| `hash-routing` | High | Hash-based routing detected |
| `missing-canonical` | High | Missing canonical tag |
| `missing-og-tags` | Medium | Missing Open Graph tags |
| `missing-structured-data` | Medium | No JSON-LD structured data |

---

## Development

```sh
# Clone
git clone https://github.com/vannseavlong/longcelot-seo.git
cd longcelot-seo

# Install (requires pnpm >= 8)
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type-check
pnpm typecheck

# Lint
pnpm lint
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All PRs must pass lint, typecheck, and tests.

---

## License

MIT — [Vannseavlong](https://github.com/vannseavlong)
