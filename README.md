# Ekips Prime Pro for VS Code

**English** · [Deutsch](README.de.md)

Language support for **[Ekips Prime Pro](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core)**
(`.ekips` files) – a small robot language for the LEGO® SPIKE™ Prime hub,
made for students in grades 7–10. It looks like TypeScript without types,
with units directly on numbers:

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

## Features

- **Syntax highlighting** – keywords, strings, comments, `Port.A`,
  `Color.Black`, known classes and methods, and **numbers with units**
  (`20cm`, `90deg`, `90°`, `1.5rot`, `2s`, `300ms`, `50%`) with their own
  colours per unit kind.
- **Editor support** – comment toggling, bracket matching, auto-closing,
  automatic indentation.
- **Snippets** – `main`, `function`, `async function`, `for`, `forof`, `if`,
  `ifelse`, `while`, `driveuntilline` (Promise.race + waitUntil), `setup`
  (motors + DriveBase), `wait`, `waituntil`, `all`.
- **Language server** – error checking, autocomplete and hover help via
  `ekips-lsp` from [Ekips Prime Pro Tools](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools)
  (installed separately; a clear message tells you if it is missing).
- **Ekips: Check File** – runs `ekips check` and shows problems in the editor.
- **Ekips: Simulate** and **Ekips: Upload to Hub** – coming with Ekips Prime Pro Tools.
- **Status bar** – shows the language server state; click for the Ekips menu.
- **Copilot instructions** – one command adds `.github/copilot-instructions.md`
  so GitHub Copilot writes correct Ekips code.
- User interface in **English and German**.

## Requirements

Highlighting, snippets and editor support work right away. For error
checking and the `ekips check` command, install
[Ekips Prime Pro Tools](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools)
so that `ekips` and `ekips-lsp` are on your `PATH` (or set their paths).

## Settings

| Setting | Default | Description |
|---|---|---|
| `ekips.lsp.enabled` | `true` | Start the language server. |
| `ekips.lsp.path` | `""` | Path to `ekips-lsp` (empty = `PATH`, `~/.cargo/bin`). |
| `ekips.cli.path` | `""` | Path to `ekips` (empty = `PATH`, `~/.cargo/bin`). |
| `ekips.messages.language` | `"auto"` | Language of compiler messages: `auto`, `en`, `de`. |
| `ekips.trace.server` | `"off"` | Log LSP communication. |

## Documentation

See [docs/](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-VSCode/tree/main/docs)
and the [language reference](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core/blob/main/docs/language.md).

## License

[MIT](LICENSE). LEGO® and SPIKE™ are trademarks of the LEGO Group, which
does not sponsor, authorize or endorse this project.
