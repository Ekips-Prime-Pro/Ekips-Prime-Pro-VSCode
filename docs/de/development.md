# Entwicklung

[English](../en/development.md)

## Skripte

| Befehl | Was er macht |
|---|---|
| `npm ci` | Abhängigkeiten installieren |
| `npm run lint` | ESLint (TypeScript) |
| `npm run compile` | Typprüfung mit `tsc`, dann `src/extension.ts` mit esbuild nach `dist/extension.js` bündeln |
| `npm run watch` | Bei jeder Änderung neu bauen |
| `npm test` | Bündeln, Unit-Tests, Grammatik-Tests |
| `npm run package` | Die `.vsix` mit `vsce` bauen |

Mit <kbd>F5</kbd> startet ein Entwicklungsfenster (Extension Development Host).

## Tests

| Ordner | Werkzeug | Prüft |
|---|---|---|
| `test/unit/` | `node --test` (mit `tsconfig.test.json` nach `out/` übersetzt) | Suche nach Programmen, Auswertung der `ekips check`-Ausgabe, Snippets, Sprachkonfiguration, Copilot-Vorlage, Übersetzungen, Aktivierung und *Datei prüfen* mit nachgebautem `vscode`-Modul und nachgebautem `ekips`-Programm |
| `test/grammar/` | [vscode-tmgrammar-test](https://github.com/PanAeon/vscode-tmgrammar-test) | TextMate-Scopes |

Module, die direkt getestet werden (`src/binary.ts`, `src/checkOutput.ts`),
dürfen `vscode` nicht importieren.

## Übersetzungen

- Befehlsnamen und Beschreibungen der Einstellungen: `package.nls.json`
  (Englisch) und `package.nls.de.json` (Deutsch).
- Meldungen zur Laufzeit: auf Englisch mit `vscode.l10n.t("…")` schreiben
  und den deutschen Text in `l10n/bundle.l10n.de.json` eintragen. Ein
  Unit-Test schlägt fehl, wenn eine Übersetzung fehlt oder übrig ist.

## CI

`.github/workflows/ci.yml` läuft bei jedem Push auf `main` und bei jedem
Pull Request: `npm ci`, Lint, Compile, Test; danach wird die Erweiterung
gepackt und **`ekips-prime-pro.vsix`** als Build-Artefakt
`ekips-prime-pro-vsix` hochgeladen.
