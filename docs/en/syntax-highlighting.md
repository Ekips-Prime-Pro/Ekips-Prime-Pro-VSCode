# Syntax highlighting

[Deutsch](../de/syntax-highlighting.md)

The extension colours `.ekips` files with a TextMate grammar
(`syntaxes/ekips.tmLanguage.json`, scope `source.ekips`).

## What is highlighted

| Element | Example | Scope |
|---|---|---|
| Keywords | `if`, `else`, `for`, `while`, `of`, `break`, `continue` | `keyword.control.*.ekips` |
| `return`, `await` | | `keyword.control.flow.ekips` |
| `async`, `function`, `const`, `let` | | `storage.modifier.async.ekips`, `storage.type.*.ekips` |
| `new` | | `keyword.operator.new.ekips` |
| `true`, `false`, `null`, `undefined` | | `constant.language.*.ekips` |
| Strings and escapes | `"hi\n"`, `'hi'` | `string.quoted.*.ekips`, `constant.character.escape.ekips` |
| Comments | `// …`, `/* … */` | `comment.line.double-slash.ekips`, `comment.block.ekips` |
| Ports, colours | `Port.A`, `Color.Black` | `constant.other.port.ekips`, `constant.other.color.ekips` |
| Known classes | `Motor`, `ColorSensor`, `DistanceSensor`, `ForceSensor`, `DriveBase`, `Port`, `Color`, `Promise`, `Math`, `console` | `support.class.ekips` |
| The hub | `hub` | `support.variable.hub.ekips` |
| Global functions | `wait`, `waitUntil` | `support.function.ekips` |
| Known methods | `drive`, `turn`, `rotate`, `sees`, `race`, … | `support.function.method.ekips` |
| Known properties | `angle`, `distance`, `heading`, `battery`, … | `support.variable.property.ekips` |
| `var` (not allowed) | | `invalid.illegal.keyword.ekips` |

## Numbers with units

Each number with a unit gets its own scope per unit kind. The digits and the
unit suffix are scoped separately, so themes can colour the unit differently.

| Kind | Units | Whole number | Digits | Suffix |
|---|---|---|---|---|
| Length | `mm`, `cm` | `constant.numeric.length.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.length.ekips` |
| Angle | `deg`, `°`, `rot` | `constant.numeric.angle.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.angle.ekips` |
| Time | `s`, `ms` | `constant.numeric.time.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.time.ekips` |
| Percent | `%` | `constant.numeric.percent.ekips` | `constant.numeric.decimal.ekips` | `keyword.other.unit.percent.ekips` |
| Unknown unit | `20km` | – | `constant.numeric.decimal.ekips` | `invalid.illegal.unit.ekips` |

`%` follows the same rule as the compiler: `50%` is a percentage, but in
`10%3`, `10%x`, `10%(…)` and `10 % 3` it is the remainder operator.

### Custom colours for units

Add this to your `settings.json` to make units stand out:

```json
"editor.tokenColorCustomizations": {
  "textMateRules": [
    { "scope": "keyword.other.unit", "settings": { "foreground": "#c586c0", "fontStyle": "italic" } }
  ]
}
```

## Tests

Grammar tests live in `test/grammar/*.test.ekips` and use
[vscode-tmgrammar-test](https://github.com/PanAeon/vscode-tmgrammar-test):

```bash
npm run test:grammar
```
