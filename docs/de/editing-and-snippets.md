# Bearbeiten und Snippets

[English](../en/editing-and-snippets.md)

## Verhalten im Editor

Festgelegt in `language-configuration.json`:

- **Kommentare:** <kbd>Strg</kbd>+<kbd>#</kbd> bzw. <kbd>Strg</kbd>+<kbd>/</kbd>
  schaltet `//` um, <kbd>Umschalt</kbd>+<kbd>Alt</kbd>+<kbd>A</kbd> schaltet
  `/* … */` um.
- **Klammern:** `()`, `[]`, `{}` werden als Paare erkannt und hervorgehoben.
- **Automatisch schließen:** Klammern, `"…"`, `'…'` und `/* … */` werden
  automatisch geschlossen.
- **Einrückung:** Nach `{`, `(` oder `[` und <kbd>Enter</kbd> wird die nächste
  Zeile eingerückt; beim Tippen von `}`, `)` oder `]` wird sie wieder
  ausgerückt.
- **Wörter:** Zahlen mit Einheiten (`20cm`, `1.5rot`, `90°`, `50%`) zählen als
  ein Wort, z. B. beim Doppelklick.
- **Einklappen:** Blöcke lassen sich über die Einrückung einklappen;
  `// region` und `// endregion` markieren eigene Bereiche.

## Snippets

Tippe das Kürzel (Präfix) und wähle das Snippet aus der Vorschlagsliste.
Mit <kbd>Tab</kbd> springst du zum nächsten Platzhalter.

| Kürzel | Fügt ein |
|---|---|
| `main` | `async function main() { … }` – der Startpunkt jedes Programms |
| `function` | `function name(params) { … }` |
| `async function`, `afunction` | `async function name(params) { … }` |
| `for` | `for (let i = 0; i < 4; i++) { … }` |
| `forof`, `for of` | `for (const item of list) { … }` |
| `if` | `if (condition) { … }` |
| `ifelse`, `if else` | `if (…) { … } else { … }` |
| `while` | `while (condition) { … }` |
| `driveuntilline`, `drive until line` | Höchstens eine Strecke fahren, aber sofort anhalten, wenn der Farbsensor eine Linie sieht (`Promise.race` + `waitUntil`), danach `robot.stop()` |
| `setup`, `drivebase` | Setup-Block: zwei Radmotoren, eine `DriveBase` und ein `ColorSensor`, mit Port-Auswahl |
| `wait` | `await wait(500ms);` |
| `waituntil` | `await waitUntil(() => …);` |
| `all`, `parallel` | `await Promise.all([…]);` |

Beispiel – `driveuntilline` wird zu:

```ts
// Drive at most 100cm, but stop as soon as the sensor sees Black.
await Promise.race([
  robot.drive(100cm, 40%),
  waitUntil(() => eye.sees(Color.Black)),
]);
robot.stop();
```

Die Kommentare in den Snippets sind englisch, wie der gesamte Code des
Projekts.
