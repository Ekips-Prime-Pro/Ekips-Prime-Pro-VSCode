# Syntaxhervorhebung

[English](../en/syntax-highlighting.md)

Die Erweiterung färbt `.ekips`-Dateien mit einer TextMate-Grammatik ein
(`syntaxes/ekips.tmLanguage.json`, Scope `source.ekips`).

## Was hervorgehoben wird

| Element | Beispiel | Scope |
|---|---|---|
| Schlüsselwörter | `if`, `else`, `for`, `while`, `of`, `break`, `continue` | `keyword.control.*.ekips` |
| `return`, `await` | | `keyword.control.flow.ekips` |
| `async`, `function`, `const`, `let` | | `storage.modifier.async.ekips`, `storage.type.*.ekips` |
| `new` | | `keyword.operator.new.ekips` |
| `true`, `false`, `null`, `undefined` | | `constant.language.*.ekips` |
| Texte und Escape-Zeichen | `"hi\n"`, `'hi'` | `string.quoted.*.ekips`, `constant.character.escape.ekips` |
| Kommentare | `// …`, `/* … */` | `comment.line.double-slash.ekips`, `comment.block.ekips` |
| Ports, Farben | `Port.A`, `Color.Black` | `constant.other.port.ekips`, `constant.other.color.ekips` |
| Bekannte Klassen | `Motor`, `ColorSensor`, `DistanceSensor`, `ForceSensor`, `DriveBase`, `Port`, `Color`, `Promise`, `Math`, `console` | `support.class.ekips` |
| Der Hub | `hub` | `support.variable.hub.ekips` |
| Globale Funktionen | `wait`, `waitUntil` | `support.function.ekips` |
| Bekannte Methoden | `drive`, `turn`, `rotate`, `sees`, `race`, … | `support.function.method.ekips` |
| Bekannte Eigenschaften | `angle`, `distance`, `heading`, `battery`, … | `support.variable.property.ekips` |
| `var` (nicht erlaubt) | | `invalid.illegal.keyword.ekips` |

## Zahlen mit Einheiten

Jede Zahl mit Einheit bekommt je nach Art der Einheit einen eigenen Scope.
Ziffern und Einheit haben getrennte Scopes, damit Farbschemata die Einheit
anders einfärben können.

| Art | Einheiten | Ganze Zahl | Ziffern | Einheit |
|---|---|---|---|---|
| Länge | `mm`, `cm` | `constant.numeric.length.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.length.ekips` |
| Winkel | `deg`, `°`, `rot` | `constant.numeric.angle.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.angle.ekips` |
| Zeit | `s`, `ms` | `constant.numeric.time.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.time.ekips` |
| Prozent | `%` | `constant.numeric.percent.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.percent.ekips` |
| Unbekannte Einheit | `20km` | – | `constant.numeric.decimal.ekips` | `invalid.illegal.unit.ekips` |

Für `%` gilt dieselbe Regel wie im Compiler: `50%` ist eine Prozentangabe,
aber in `10%3`, `10%x`, `10%(…)` und `10 % 3` ist es der Rest-Operator.

### Eigene Farben für Einheiten

Mit diesem Eintrag in der `settings.json` fallen Einheiten stärker auf:

```json
"editor.tokenColorCustomizations": {
  "textMateRules": [
    { "scope": "keyword.other.unit", "settings": { "foreground": "#c586c0", "fontStyle": "italic" } }
  ]
}
```

## Tests

Die Grammatik-Tests liegen in `test/grammar/*.test.ekips` und nutzen
[vscode-tmgrammar-test](https://github.com/PanAeon/vscode-tmgrammar-test):

```bash
npm run test:grammar
```
