# Getting started

[Deutsch](../de/getting-started.md)

## Install

1. Install the extension **Ekips Prime Pro** from the Marketplace, or a
   `.vsix` file: *Extensions* view → `…` → *Install from VSIX…*.
2. Open a folder and create a file that ends in **`.ekips`**, for example
   `main.ekips`. VS Code recognises it as the language *Ekips Prime Pro*
   (language ID `ekips`).

## Build from source

```bash
npm ci
npm run compile
npm run package   # creates ekips-prime-pro-<version>.vsix
```

Press <kbd>F5</kbd> in VS Code to start a development window with the
extension loaded.
