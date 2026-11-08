# Befehle und Statusleiste

[English](../en/commands.md)

Alle Befehle stehen in der Befehlspalette (<kbd>Strg</kbd>+<kbd>Umschalt</kbd>+<kbd>P</kbd>)
unter der Kategorie **Ekips**. Die Anzeigesprache folgt VS Code (Deutsch
oder Englisch).

| Befehl | ID | Was er macht |
|---|---|---|
| **Ekips: Datei prüfen** | `ekips.checkFile` | Speichert die Datei und startet `ekips check <Datei>`. Probleme erscheinen im Editor und im Bereich *Probleme*. |
| **Ekips: Simulieren** | `ekips.simulate` | Platzhalter – der Simulator kommt mit den Ekips Prime Pro Tools. |
| **Ekips: Auf den Hub laden** | `ekips.uploadToHub` | Platzhalter – das Hochladen kommt mit den Ekips Prime Pro Tools. |
| **Ekips: Sprachserver neu starten** | `ekips.restartLanguageServer` | Beendet `ekips-lsp` und startet ihn neu. |
| **Ekips: Copilot-Anweisungen zum Projekt hinzufügen** | `ekips.createCopilotInstructions` | Siehe [Copilot-Anweisungen](copilot-instructions.md). |
| **Ekips: Menü anzeigen** | `ekips.showMenu` | Schnellmenü mit allen Befehlen oben (öffnet sich auch über die Statusleiste). |
| **Ekips: Einstellungen öffnen** | `ekips.openSettings` | Öffnet die Einstellungen der Erweiterung. |

*Datei prüfen*, *Simulieren* und *Auf den Hub laden* sind auch Knöpfe oben
rechts im Editor, wenn eine `.ekips`-Datei offen ist. *Datei prüfen* steht
außerdem im Kontextmenü von Editor und Explorer.

## Ekips: Datei prüfen

- Startet `ekips check [--de] <Datei>` im Ordner der Datei. `--de` wird
  angehängt, wenn die Meldungen auf Deutsch sein sollen
  (`ekips.messages.language`).
- Das Programm `ekips` wird wie `ekips-lsp` gesucht: Einstellung
  **`ekips.cli.path`**, sonst `PATH` und `~/.cargo/bin`. Fehlt es, erklärt
  eine Meldung, wie du es bekommst.
- Die Ausgabe wird ausgewertet (englisches oder deutsches Format des
  Ekips-Compilers):

  ```text
  Fehler: Diesem Text fehlt das schließende Anführungszeichen.
   --> main.ekips:3:12
    |
  3 |   hub.show("Hi);
    |            ^^^^
    = Hilfe: …
  ```

  Jedes Problem wird mit dem markierten Bereich (`^^^^`) im Editor
  angezeigt; die `Hilfe`-Zeile wird an die Meldung angehängt. Die ganze
  Ausgabe steht im Ausgabe-Bereich **Ekips Prime Pro**.
- Die Ergebnisse verschwinden, sobald du die Datei änderst.

## Statusleiste

Ist eine `.ekips`-Datei aktiv, zeigt die Statusleiste **Ekips** mit dem
Zustand des Sprachservers:

| Symbol | Bedeutung |
|---|---|
| drehend | Server startet |
| ✓ | Server läuft |
| ⚠ (gelb) | `ekips-lsp` nicht gefunden |
| ⊘ | Server ausgeschaltet (`ekips.lsp.enabled = false`) |
| ■ / ✕ (gelb) | Server beendet / Start fehlgeschlagen |

Ein Klick darauf öffnet das Ekips-Menü.
