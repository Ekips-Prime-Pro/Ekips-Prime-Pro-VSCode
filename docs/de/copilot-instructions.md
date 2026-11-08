# Copilot-Anweisungen für Schülerprojekte

[English](../en/copilot-instructions.md)

GitHub Copilot kennt Ekips Prime Pro nicht. Ohne Hilfe schreibt es
TypeScript-Typen, erfindet Methoden oder vergisst Einheiten. Eine Datei
**`.github/copilot-instructions.md`** im Projekt erklärt Copilot (Chat und
Code-Vervollständigung), wie die Sprache funktioniert.

## Zum Projekt hinzufügen

Starte **Ekips: Copilot-Anweisungen zum Projekt hinzufügen** aus der
Befehlspalette (oder dem Ekips-Menü in der Statusleiste). Die Erweiterung
kopiert die Vorlage nach `.github/copilot-instructions.md` im geöffneten
Ordner und öffnet sie. Gibt es die Datei schon, kannst du sie überschreiben
oder die vorhandene öffnen.

Du kannst die Vorlage auch von Hand kopieren:
[`templates/copilot-instructions.md`](../../templates/copilot-instructions.md).

## Was in der Vorlage steht

- Wer die Nutzer sind (Schülerinnen und Schüler, Klasse 7–10) und wie
  erklärt werden soll: einfache Worte, in der Sprache der Schüler;
  Code-Kommentare auf Englisch.
- Die Regeln der Sprache: TypeScript ohne Typen, `async function main()`,
  was es nicht gibt (`class`, `var`, `import`, …).
- Alle Einheiten (`mm`, `cm`, `deg`, `°`, `rot`, `s`, `ms`, `%`) und die
  Regel „kein Leerzeichen zwischen Zahl und Einheit".
- Die ganze Standardbibliothek: `DriveBase`, `Motor`, Sensoren, `hub`,
  `wait`, `waitUntil`, `Promise.all`/`race`, `Math`, `Color.*`, `Port.*`.
- Welche Befehle ein Promise liefern und mit `await` abgewartet werden müssen.
- Typische Muster (Quadrat, parallele Bewegungen, bis zur Linie fahren,
  Missionen) und häufige Fehler.

Die Vorlage selbst ist auf Englisch, weil Copilot englische Anweisungen am
zuverlässigsten befolgt; sie weist Copilot an, in der Sprache der Schüler zu
antworten. Lehrkräfte können die Datei um eigene Regeln ergänzen (z. B. Maße
des Roboters, welcher Motor an welchem Port hängt).

Halte die Vorlage mit der
[Sprachreferenz](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core/blob/main/docs/language.md)
synchron.
