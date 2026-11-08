# Ekips Prime Pro für VS Code

[English](README.md) · **Deutsch**

Sprachunterstützung für **[Ekips Prime Pro](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core)**
(`.ekips`-Dateien) – eine kleine Robotersprache für den LEGO® SPIKE™ Prime
Hub, gemacht für Schülerinnen und Schüler der Klassen 7–10. Sie sieht aus
wie TypeScript ohne Typen, mit Einheiten direkt an den Zahlen:

```ts
const robot = new DriveBase(new Motor(Port.A), new Motor(Port.B), 56mm, 112mm);
const eye = new ColorSensor(Port.C);

async function main() {
  // Drive at most 1 m, but stop at the black line.
  await Promise.race([
    robot.drive(100cm, 40%),
    waitUntil(() => eye.sees(Color.Black)),
  ]);
  robot.stop();
  await robot.turn(90deg);
}
```

## Funktionen

- **Syntaxhervorhebung** – Schlüsselwörter, Texte, Kommentare, `Port.A`,
  `Color.Black`, bekannte Klassen und Methoden sowie **Zahlen mit Einheiten**
  (`20cm`, `90deg`, `90°`, `1.5rot`, `2s`, `300ms`, `50%`) mit eigenen
  Farben je Art der Einheit.
- **Editor-Unterstützung** – Kommentare umschalten, Klammerpaare,
  automatisches Schließen, automatisches Einrücken.
- **Snippets** – `main`, `function`, `async function`, `for`, `forof`, `if`,
  `ifelse`, `while`, `driveuntilline` (Promise.race + waitUntil), `setup`
  (Motoren + DriveBase), `wait`, `waituntil`, `all`.
- **Sprachserver** – Fehlerprüfung, Autovervollständigung und Hilfe beim
  Darüberfahren über `ekips-lsp` aus den
  [Ekips Prime Pro Tools](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools)
  (separat installieren; eine verständliche Meldung sagt dir, wenn er fehlt).
- **Ekips: Datei prüfen** – startet `ekips check` und zeigt Probleme im Editor.
- **Ekips: Simulieren** und **Ekips: Auf den Hub laden** – kommen mit den Ekips Prime Pro Tools.
- **Statusleiste** – zeigt den Zustand des Sprachservers; Klick öffnet das Ekips-Menü.
- **Copilot-Anweisungen** – ein Befehl legt `.github/copilot-instructions.md`
  an, damit GitHub Copilot korrekten Ekips-Code schreibt.
- Oberfläche auf **Deutsch und Englisch**.

## Voraussetzungen

Farben, Snippets und Editor-Unterstützung funktionieren sofort. Für die
Fehlerprüfung und den Befehl `ekips check` installiere die
[Ekips Prime Pro Tools](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools),
sodass `ekips` und `ekips-lsp` im `PATH` liegen (oder trage ihre Pfade ein).

## Einstellungen

| Einstellung | Standard | Beschreibung |
|---|---|---|
| `ekips.lsp.enabled` | `true` | Den Sprachserver starten. |
| `ekips.lsp.path` | `""` | Pfad zu `ekips-lsp` (leer = `PATH`, `~/.cargo/bin`). |
| `ekips.cli.path` | `""` | Pfad zu `ekips` (leer = `PATH`, `~/.cargo/bin`). |
| `ekips.messages.language` | `"auto"` | Sprache der Compiler-Meldungen: `auto`, `en`, `de`. |
| `ekips.trace.server` | `"off"` | LSP-Kommunikation mitschreiben. |

## Dokumentation

Siehe [docs/](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-VSCode/tree/main/docs)
und die [Sprachreferenz](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core/blob/main/docs/language.md).

## Lizenz

[MIT](LICENSE). LEGO® und SPIKE™ sind Marken der LEGO Gruppe, die dieses
Projekt weder sponsert noch autorisiert oder unterstützt.
