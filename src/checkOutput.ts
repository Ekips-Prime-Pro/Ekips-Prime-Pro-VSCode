// Parses the human-readable output of `ekips check`.
// This module must not import "vscode" so it can be unit-tested with plain Node.
//
// The format is the one rendered by the Ekips compiler (English or German):
//
//   error: This text is missing its closing quote.
//    --> main.ekips:3:13
//     |
//   3 |   hub.show("Hi);
//     |            ^^^^
//     = help: Add `"` at the end of the text.

export type CheckSeverity = "error" | "warning";

export interface CheckProblem {
  severity: CheckSeverity;
  message: string;
  file: string;
  /** 1-based line */
  line: number;
  /** 1-based column (in characters) */
  column: number;
  /** Number of characters marked with ^ (at least 1). */
  length: number;
  hint?: string;
}

const HEADER = /^(error|warning|Fehler|Warnung):\s*(.*)$/;
const LOCATION = /^\s*-->\s*(.*):(\d+):(\d+)\s*$/;
const CARETS = /^\s*\|\s?(\s*)(\^+)\s*$/;
const HINT = /^\s*=\s*(?:help|Hilfe):\s*(.*)$/;

function severityOf(label: string): CheckSeverity {
  return label === "warning" || label === "Warnung" ? "warning" : "error";
}

/** Extracts all problems from the output of `ekips check`. */
export function parseCheckOutput(output: string): CheckProblem[] {
  const problems: CheckProblem[] = [];
  let current: CheckProblem | undefined;
  let pending: { severity: CheckSeverity; message: string } | undefined;

  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, "");

    const header = HEADER.exec(line);
    if (header) {
      pending = { severity: severityOf(header[1]), message: header[2] };
      current = undefined;
      continue;
    }

    const location = LOCATION.exec(line);
    if (location && pending) {
      current = {
        ...pending,
        file: location[1],
        line: Number(location[2]),
        column: Number(location[3]),
        length: 1,
      };
      problems.push(current);
      pending = undefined;
      continue;
    }

    if (!current) {
      continue;
    }

    const carets = CARETS.exec(line);
    if (carets) {
      current.length = carets[2].length;
      continue;
    }

    const hint = HINT.exec(line);
    if (hint) {
      current.hint = hint[1];
    }
  }
  return problems;
}
