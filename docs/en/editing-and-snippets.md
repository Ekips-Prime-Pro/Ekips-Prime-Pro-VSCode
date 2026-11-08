# Editing and snippets

[Deutsch](../de/editing-and-snippets.md)

## Editor behaviour

Defined in `language-configuration.json`:

- **Comments:** <kbd>Ctrl</kbd>+<kbd>/</kbd> toggles `//`,
  <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>A</kbd> toggles `/* … */`.
- **Brackets:** `()`, `[]`, `{}` are matched and highlighted.
- **Auto-close:** brackets, `"…"`, `'…'` and `/* … */` are closed automatically.
- **Indentation:** pressing <kbd>Enter</kbd> after `{`, `(` or `[` indents
  the next line; typing `}`, `)` or `]` outdents it again.
- **Words:** numbers with units (`20cm`, `1.5rot`, `90°`, `50%`) count as one
  word for double-click selection and word navigation.
- **Folding:** blocks fold by indentation; `// region` and `// endregion`
  mark custom foldable regions.

## Snippets

Type the prefix and pick the snippet from the suggestion list. Press
<kbd>Tab</kbd> to jump to the next placeholder.

| Prefix | Inserts |
|---|---|
| `main` | `async function main() { … }` – the entry point of every program |
| `function` | `function name(params) { … }` |
| `async function`, `afunction` | `async function name(params) { … }` |
| `for` | `for (let i = 0; i < 4; i++) { … }` |
| `forof`, `for of` | `for (const item of list) { … }` |
| `if` | `if (condition) { … }` |
| `ifelse`, `if else` | `if (…) { … } else { … }` |
| `while` | `while (condition) { … }` |
| `driveuntilline`, `drive until line` | Drive at most a distance, but stop as soon as the color sensor sees a line (`Promise.race` + `waitUntil`), then `robot.stop()` |
| `setup`, `drivebase` | Setup block: two wheel motors, a `DriveBase` and a `ColorSensor`, with port choices |
| `wait` | `await wait(500ms);` |
| `waituntil` | `await waitUntil(() => …);` |
| `all`, `parallel` | `await Promise.all([…]);` |

Example – `driveuntilline` expands to:

```ts
// Drive at most 100cm, but stop as soon as the sensor sees Black.
await Promise.race([
  robot.drive(100cm, 40%),
  waitUntil(() => eye.sees(Color.Black)),
]);
robot.stop();
```
