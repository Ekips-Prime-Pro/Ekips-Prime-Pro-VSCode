# Sprachserver

[English](../en/language-server.md)

Fehlerprüfung beim Tippen, Autovervollständigung und Hilfe beim Darüberfahren
kommen vom **Ekips-Sprachserver** `ekips-lsp`. Er gehört zu den
[Ekips Prime Pro Tools](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools)
und ist **nicht** in der Erweiterung enthalten.

## So findet die Erweiterung `ekips-lsp`

1. Ist die Einstellung **`ekips.lsp.path`** gesetzt, wird genau diese Datei
   verwendet.
   - `~` wird durch deinen Benutzerordner ersetzt.
   - Ein relativer Pfad (`./bin/ekips-lsp`) gilt ab dem ersten
     Arbeitsbereichsordner.
   - Ein reiner Name (`ekips-lsp-dev`) wird im `PATH` gesucht.
2. Sonst wird `ekips-lsp` im `PATH` und in `~/.cargo/bin` gesucht (dorthin
   installiert `cargo install`). Unter Windows werden `.exe`/`.cmd`
   automatisch ergänzt.

Der Server wird über **stdio** gestartet. Die Erweiterung schickt die
Sprache der Meldungen als `initializationOptions.language` (`"en"` oder
`"de"`, siehe `ekips.messages.language`).

## Wenn `ekips-lsp` fehlt

Die Erweiterung funktioniert trotzdem: Farben, Snippets und das Verhalten im
Editor brauchen den Server nicht. Du siehst:

- eine Warnung, die erklärt, was fehlt, mit den Knöpfen **Pfad festlegen**,
  **Ekips Tools holen** und **Nicht mehr anzeigen**;
- einen gelben Eintrag `⚠ Ekips` in der Statusleiste.

Nach dem Installieren der Tools starte **Ekips: Sprachserver neu starten**
(oder ändere `ekips.lsp.path`; dann startet der Server von selbst neu). Der
Befehl zeigt die Warnung auch dann wieder, wenn du *Nicht mehr anzeigen*
gewählt hast.

## Fehlersuche

- Ausgabe-Bereich → **Ekips Prime Pro** zeigt, welche Datei gestartet wurde,
  und eventuelle Fehler.
- Setze `ekips.trace.server` auf `messages` oder `verbose`, um die
  LSP-Kommunikation mitzuschreiben.
- Setze `ekips.lsp.enabled` auf `false`, um den Server auszuschalten.
