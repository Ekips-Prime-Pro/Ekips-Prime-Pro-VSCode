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

## Settings

| Setting | Default | Description |
|---|---|---|
| `ekips.lsp.enabled` | `true` | Start the language server `ekips-lsp`. |
| `ekips.lsp.path` | `""` | Path to `ekips-lsp`. Empty = search `PATH` and `~/.cargo/bin`. See [Language server](language-server.md). |
| `ekips.cli.path` | `""` | Path to the `ekips` command-line program. Empty = search `PATH` and `~/.cargo/bin`. |
| `ekips.messages.language` | `"auto"` | Language of compiler messages: `auto` (VS Code display language), `en`, `de`. |
| `ekips.trace.server` | `"off"` | Log LSP communication: `off`, `messages`, `verbose`. |

The user interface of the extension (commands, messages) is available in
English and German and follows the VS Code display language.
