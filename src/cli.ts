// Runs the Ekips command-line tool (`ekips`).
import { execFile } from "node:child_process";
import * as path from "node:path";
import * as vscode from "vscode";
import { CheckProblem, parseCheckOutput } from "./checkOutput";
import { messageLanguage, resolveCli, TOOLS_URL } from "./settings";

export interface CliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

/** Runs `ekips <args>` and resolves with its output (never rejects on a non-zero exit code). */
function runEkips(executable: string, args: string[], cwd: string | undefined): Promise<CliResult> {
  return new Promise((resolve, reject) => {
    execFile(executable, args, { cwd, timeout: 60_000, windowsHide: true }, (error, stdout, stderr) => {
      if (error && typeof error.code !== "number") {
        // Could not start the program at all (e.g. ENOENT, EACCES, timeout).
        reject(error);
        return;
      }
      resolve({ exitCode: typeof error?.code === "number" ? error.code : 0, stdout, stderr });
    });
  });
}

/** Shows a friendly message if `ekips` is missing. Returns its path if found. */
export async function findCliOrExplain(): Promise<string | undefined> {
  const resolved = resolveCli();
  if (resolved.found) {
    return resolved.path;
  }
  const detail =
    resolved.reason === "configuredMissing"
      ? vscode.l10n.t("The file set in \"ekips.cli.path\" does not exist or is not executable: {0}", resolved.path)
      : vscode.l10n.t("The program \"ekips\" was not found on this computer.");
  const openSettings = vscode.l10n.t("Set path");
  const download = vscode.l10n.t("Get Ekips Tools");
  const choice = await vscode.window.showWarningMessage(
    `${detail} ${vscode.l10n.t("Install Ekips Prime Pro Tools or set the path in the setting \"ekips.cli.path\".")}`,
    openSettings,
    download,
  );
  if (choice === openSettings) {
    await vscode.commands.executeCommand("workbench.action.openSettings", "ekips.cli.path");
  } else if (choice === download) {
    await vscode.env.openExternal(vscode.Uri.parse(TOOLS_URL));
  }
  return undefined;
}

function toDiagnostic(problem: CheckProblem): vscode.Diagnostic {
  const line = Math.max(problem.line - 1, 0);
  const column = Math.max(problem.column - 1, 0);
  const range = new vscode.Range(line, column, line, column + problem.length);
  const message = problem.hint ? `${problem.message}\n${problem.hint}` : problem.message;
  const severity =
    problem.severity === "warning" ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error;
  const diagnostic = new vscode.Diagnostic(range, message, severity);
  diagnostic.source = "ekips check";
  return diagnostic;
}

/** Implements the command "Ekips: Check File". */
export async function checkFile(
  diagnostics: vscode.DiagnosticCollection,
  output: vscode.OutputChannel,
  uri?: vscode.Uri,
): Promise<void> {
  const document = uri
    ? await vscode.workspace.openTextDocument(uri)
    : vscode.window.activeTextEditor?.document;
  if (!document || document.languageId !== "ekips") {
    void vscode.window.showInformationMessage(vscode.l10n.t("Open an .ekips file first, then run \"Ekips: Check File\"."));
    return;
  }
  if (document.isUntitled) {
    void vscode.window.showInformationMessage(vscode.l10n.t("Save the file first, then run \"Ekips: Check File\"."));
    return;
  }
  if (document.isDirty && !(await document.save())) {
    return;
  }

  const executable = await findCliOrExplain();
  if (!executable) {
    return;
  }

  const file = document.uri.fsPath;
  const args = ["check", ...(messageLanguage() === "de" ? ["--de"] : []), file];
  output.appendLine(`> ${executable} ${args.join(" ")}`);

  let result: CliResult;
  try {
    result = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Window, title: vscode.l10n.t("Ekips: checking {0}", path.basename(file)) },
      () => runEkips(executable, args, path.dirname(file)),
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    output.appendLine(message);
    void vscode.window.showErrorMessage(vscode.l10n.t("\"ekips check\" could not be run: {0}", message));
    return;
  }

  const text = `${result.stdout}${result.stderr}`;
  output.append(text.endsWith("\n") || text === "" ? text : `${text}\n`);

  const problems = parseCheckOutput(text).filter(
    (p) => path.resolve(path.dirname(file), p.file) === path.resolve(file) || p.file === file,
  );
  diagnostics.set(document.uri, problems.map(toDiagnostic));

  if (problems.length > 0) {
    const show = vscode.l10n.t("Show problems");
    const choice = await vscode.window.showWarningMessage(
      vscode.l10n.t("{0}: {1} problem(s) found.", path.basename(file), problems.length),
      show,
    );
    if (choice === show) {
      await vscode.commands.executeCommand("workbench.actions.view.problems");
    }
  } else if (result.exitCode === 0) {
    void vscode.window.showInformationMessage(vscode.l10n.t("{0}: no problems found.", path.basename(file)));
  } else {
    output.show(true);
    void vscode.window.showErrorMessage(
      vscode.l10n.t("\"ekips check\" failed (exit code {0}). See the output for details.", result.exitCode),
    );
  }
}
