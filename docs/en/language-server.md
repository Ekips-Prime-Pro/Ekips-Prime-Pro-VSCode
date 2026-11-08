# Language server

[Deutsch](../de/language-server.md)

Error checking while you type, autocomplete and hover help come from the
**Ekips language server** `ekips-lsp`. It is part of
[Ekips Prime Pro Tools](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools)
and is **not** bundled with the extension.

## How the extension finds `ekips-lsp`

1. If the setting **`ekips.lsp.path`** is set, exactly that file is used.
   - `~` is replaced by your home folder.
   - A relative path (`./bin/ekips-lsp`) is resolved against the first
     workspace folder.
   - A bare name (`ekips-lsp-dev`) is searched on the `PATH`.
2. Otherwise `ekips-lsp` is searched on the `PATH` and in `~/.cargo/bin`
   (where `cargo install` puts it). On Windows, `.exe`/`.cmd` are added
   automatically.

The server is started with **stdio** as transport. The extension sends the
message language as `initializationOptions.language` (`"en"` or `"de"`, see
`ekips.messages.language`).

## If `ekips-lsp` is missing

The extension still works: syntax colours, snippets and the editor
behaviour do not need the server. You see:

- a warning that explains what is missing, with the buttons
  **Set path**, **Get Ekips Tools** and **Don't show again**;
- a yellow status bar entry `⚠ Ekips`.

After installing the tools, run **Ekips: Restart Language Server** (or
change `ekips.lsp.path`; the server restarts automatically). The command
shows the warning again even if you chose *Don't show again*.

## Troubleshooting

- Output panel → **Ekips Prime Pro** shows which file was started and any
  errors.
- Set `ekips.trace.server` to `messages` or `verbose` to log the LSP
  communication.
- Set `ekips.lsp.enabled` to `false` to turn the server off.
