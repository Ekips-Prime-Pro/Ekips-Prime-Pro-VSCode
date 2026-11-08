# Erste Schritte

[English](../en/getting-started.md)

## Installieren

1. Installiere die Erweiterung **Ekips Prime Pro** aus dem Marketplace oder
   eine `.vsix`-Datei: Ansicht *Erweiterungen* → `…` → *Aus VSIX installieren…*.
2. Öffne einen Ordner und lege eine Datei an, die auf **`.ekips`** endet, zum
   Beispiel `main.ekips`. VS Code erkennt sie als Sprache *Ekips Prime Pro*
   (Sprach-ID `ekips`).

## Aus dem Quellcode bauen

```bash
npm ci
npm run compile
npm run package   # erzeugt ekips-prime-pro-<version>.vsix
```

Drücke in VS Code <kbd>F5</kbd>, um ein Entwicklungsfenster mit geladener
Erweiterung zu starten.
