# CLAUDE.md – Ekips Prime Pro VS Code extension

## Project context

- This repository is the **VS Code extension** for *Ekips Prime Pro*, a small
  robot language for the LEGO® SPIKE™ Prime hub. Target users are students
  in grades 7–10 (and the AI assistants that help them).
- Language files end in `.ekips`, language ID `ekips`.
- The language is **TypeScript without type annotations**, plus **units on
  numbers**: `20cm`, `150mm`, `90deg`, `90°`, `1.5rot`, `2s`, `300ms`, `50%`.
  `async`/`await`, `Promise.all`/`Promise.race`, entry point
  `async function main()`, comments `//` and `/* */`. Objects such as
  `robot.drive()`, `arm.rotate()`, `eye.sees(Color.Black)`, `new Motor(Port.A)`.
- Language reference (single source of truth):
  <https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core> → `docs/language.md`
  (English; `docs/en/language.md` / `docs/de/language.md` once split).
- The language server (`ekips-lsp`) and CLI (`ekips check`, simulator, upload)
  live in <https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools>.
  This extension only *starts* them; it does not bundle them.

## Rules

1. **English only** in code (TypeScript), code comments and commit messages.
2. **Document every feature immediately** under `/docs`, **always in both
   languages**: `docs/en/...` and `docs/de/...` (same file names). Update
   `docs/README.md` (index, both languages) when adding a page.
3. The Marketplace README exists in both languages: `README.md` (English)
   and `README.de.md` (German). Keep them in sync.
4. **Lint, build and tests must be green in CI** (`npm run lint`,
   `npm run compile`, `npm test`). Run them before every push.
5. Small, focused commits; push regularly.
6. User-facing messages are written for students: plain words, say what is
   wrong and how to fix it.

## Layout

| Path | Purpose |
|---|---|
| `src/extension.ts` | Activation: language client, commands, status bar |
| `src/lsp.ts` | Starts `ekips-lsp` via `vscode-languageclient` |
| `src/cli.ts` | Runs `ekips check` (command *Ekips: Check File*) |
| `src/commands.ts`, `src/statusBar.ts`, `src/copilot.ts` | Commands, status bar, Copilot template command |
| `src/settings.ts` | Typed settings access |
| `package.nls*.json`, `l10n/` | UI translations (English / German) |
| `src/checkOutput.ts` | Parses `ekips check` output (no `vscode` import, unit-tested) |
| `src/binary.ts` | Resolves binary paths from settings / `PATH` (no `vscode` import) |
| `syntaxes/ekips.tmLanguage.json` | TextMate grammar |
| `language-configuration.json` | Comments, brackets, auto-close, indentation |
| `snippets/ekips.code-snippets` | Snippets |
| `templates/` | Files copied into student projects (Copilot instructions) |
| `test/grammar/` | Grammar tests (`vscode-tmgrammar-test`) |
| `test/unit/` | `node --test` unit tests (pure modules, contributions, l10n, activation with a fake `vscode`) |
| `docs/en`, `docs/de` | Documentation (bilingual) |

## Commands

```bash
npm ci            # install
npm run lint      # ESLint
npm run compile   # type-check + esbuild bundle to dist/
npm test          # unit tests + grammar tests
npm run package   # build .vsix
```
