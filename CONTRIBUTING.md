# Contributing to longcelot-seo

Thank you for your interest in contributing! `longcelot-seo` is maintained solely by **Vannseavlong**, but community contributions via pull requests are welcome under the MIT license.

---

## Ground Rules

- All architectural decisions and release approvals rest with the owner (Vannseavlong)
- No `any` in TypeScript — the ESLint rule `@typescript-eslint/no-explicit-any` is set to `error`
- Every feature must have tests — PRs without tests will not be merged
- Commit messages follow **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`

---

## Getting Started

```sh
# 1. Fork the repo and clone your fork
git clone https://github.com/<your-username>/longcelot-seo.git
cd longcelot-seo

# 2. Install dependencies (requires pnpm >= 8)
pnpm install

# 3. Build
pnpm build

# 4. Run tests
pnpm test
```

---

## Branch Naming

| Change type | Pattern |
|---|---|
| New feature | `feature/short-description` |
| Bug fix | `fix/short-description` |
| Docs / chore | `chore/short-description` |
| Test | `test/short-description` |

---

## Pull Request Checklist

Before opening a PR, verify:

- [ ] No `any` — all types are explicit
- [ ] Tests added for all new/changed behaviour
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes with zero warnings
- [ ] `pnpm typecheck` passes
- [ ] Commit messages follow Conventional Commits
- [ ] One logical change per PR

---

## Code Style

- ESLint + Prettier are enforced via Husky pre-commit hook
- Run `pnpm format` to auto-format
- Functions > 40 lines should be split
- Use `async/await` — avoid nested callbacks
- Delete dead code rather than commenting it out

---

## Testing Requirements

| Layer | Requirement |
|---|---|
| CLI rules (`packages/core/rules/`) | Unit test with ≥1 passing fixture and ≥1 failing fixture |
| Scanner (`packages/scanner/`) | Integration test against `__fixtures__/` sample projects |
| API Route Handlers | Unit tests mocking Zod validation and DB calls |
| React Components | `@testing-library/react` — render + interaction tests |

Minimum coverage: **70% line coverage** (enforced in CI).

---

## Reporting Issues

Use the GitHub issue templates:
- [Bug Report](https://github.com/vannseavlong/longcelot-seo/issues/new?template=bug_report.md)
- [Feature Request](https://github.com/vannseavlong/longcelot-seo/issues/new?template=feature_request.md)
