# Commands and status bar

[Deutsch](../de/commands.md)

All commands are in the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>)
under the category **Ekips**. The display language follows VS Code
(English or German).

| Command | ID | What it does |
|---|---|---|
| **Ekips: Check File** | `ekips.checkFile` | Saves the file and runs `ekips check <file>`. Problems appear in the editor and the *Problems* panel. |
| **Ekips: Simulate** | `ekips.simulate` | Placeholder – the simulator comes with Ekips Prime Pro Tools. |
| **Ekips: Upload to Hub** | `ekips.uploadToHub` | Placeholder – uploading comes with Ekips Prime Pro Tools. |
| **Ekips: Restart Language Server** | `ekips.restartLanguageServer` | Stops and starts `ekips-lsp`. |
| **Ekips: Add Copilot Instructions to Project** | `ekips.createCopilotInstructions` | See [Copilot instructions](copilot-instructions.md). |
| **Ekips: Show Menu** | `ekips.showMenu` | Quick menu with all of the above (also opened from the status bar). |
| **Ekips: Open Settings** | `ekips.openSettings` | Opens the extension settings. |

*Check File*, *Simulate* and *Upload to Hub* are also buttons in the editor
title bar of `.ekips` files. *Check File* is in the editor and explorer
context menus.

## Ekips: Check File

- Runs `ekips check [--de] <file>` in the folder of the file. `--de` is
  added when the message language is German (`ekips.messages.language`).
- The `ekips` program is found like `ekips-lsp`: setting **`ekips.cli.path`**,
  otherwise `PATH` and `~/.cargo/bin`. If it is missing, a message explains
  how to get it.
- The output is parsed (English or German format of the Ekips compiler):

  ```text
  error: This text is missing its closing quote.
   --> main.ekips:3:12
    |
  3 |   hub.show("Hi);
    |            ^^^^
    = help: Add `"` at the end of the text.
  ```

  Each problem becomes a diagnostic with the marked range (`^^^^`); the
  `help` line is added to the message. The full output is in the output
  panel **Ekips Prime Pro**.
- The results disappear as soon as you edit the file.

## Status bar

When an `.ekips` file is active, the status bar shows **Ekips** with the
state of the language server:

| Icon | Meaning |
|---|---|
| spinning | Server is starting |
| ✓ | Server is running |
| ⚠ (yellow) | `ekips-lsp` not found |
| ⊘ | Server turned off (`ekips.lsp.enabled = false`) |
| ■ / ✕ (yellow) | Server stopped / failed to start |

Click it to open the Ekips menu.
