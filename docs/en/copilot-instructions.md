# Copilot instructions for student projects

[Deutsch](../de/copilot-instructions.md)

GitHub Copilot does not know Ekips Prime Pro. Without help it writes
TypeScript types, invents methods or forgets units. A file
**`.github/copilot-instructions.md`** in the project tells Copilot (Chat and
code completion) how the language works.

## Add it to a project

Run **Ekips: Add Copilot Instructions to Project** from the Command Palette
(or the Ekips menu in the status bar). The extension copies the template
into `.github/copilot-instructions.md` of the open folder and opens it. If
the file already exists, you can overwrite it or open the existing one.

You can also copy the template by hand:
[`templates/copilot-instructions.md`](../../templates/copilot-instructions.md).

## What the template contains

- Who the users are (students, grades 7–10) and how to explain: simple words,
  in the student's language; code comments in English.
- The language rules: TypeScript without types, `async function main()`,
  what is not available (`class`, `var`, `import`, …).
- All units (`mm`, `cm`, `deg`, `°`, `rot`, `s`, `ms`, `%`) and the rule
  "no space between number and unit".
- The full standard library: `DriveBase`, `Motor`, sensors, `hub`, `wait`,
  `waitUntil`, `Promise.all`/`race`, `Math`, `Color.*`, `Port.*`.
- Which commands return a Promise and must be awaited.
- Typical patterns (square, parallel movements, drive until line, missions)
  and common mistakes.

Teachers can extend the file with project-specific rules (e.g. robot
dimensions, which motor is on which port).

Keep the template in sync with the
[language reference](https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Core/blob/main/docs/language.md).
