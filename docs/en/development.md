# Development

[Deutsch](../de/development.md)

## Scripts

| Command | What it does |
|---|---|
| `npm ci` | Install dependencies |
| `npm run lint` | ESLint (TypeScript) |
| `npm run compile` | Type-check with `tsc`, then bundle `src/extension.ts` to `dist/extension.js` with esbuild |
| `npm run watch` | Rebuild on every change |
| `npm test` | Bundle, unit tests, grammar tests |
| `npm run package` | Build the `.vsix` with `vsce` |

Press <kbd>F5</kbd> to start an Extension Development Host.

## Tests

| Folder | Runner | Covers |
|---|---|---|
| `test/unit/` | `node --test` (compiled with `tsconfig.test.json` to `out/`) | Executable lookup, `ekips check` output parser, snippets, language configuration, Copilot template, translations, activation and *Check File* with a fake `vscode` module and a fake `ekips` program |
| `test/grammar/` | [vscode-tmgrammar-test](https://github.com/PanAeon/vscode-tmgrammar-test) | TextMate scopes |

Modules that are unit-tested directly (`src/binary.ts`,
`src/checkOutput.ts`) must not import `vscode`.

## Translations

- Command titles and setting descriptions: `package.nls.json` (English) and
  `package.nls.de.json` (German).
- Runtime messages: write them in English with `vscode.l10n.t("…")` and add
  the German text to `l10n/bundle.l10n.de.json`. A unit test fails if a
  translation is missing or unused.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every pull
request: `npm ci`, lint, compile, test, then packages the extension and
uploads **`ekips-prime-pro.vsix`** as the build artifact
`ekips-prime-pro-vsix`.
