// Copies the Copilot instructions template into the student's project.
import * as vscode from "vscode";

const TEMPLATE = ["templates", "copilot-instructions.md"];
const TARGET = [".github", "copilot-instructions.md"];

/** Implements the command "Ekips: Add Copilot Instructions to Project". */
export async function createCopilotInstructions(context: vscode.ExtensionContext): Promise<void> {
  const folders = vscode.workspace.workspaceFolders ?? [];
  if (folders.length === 0) {
    void vscode.window.showInformationMessage(vscode.l10n.t("Open a project folder first."));
    return;
  }
  const folder =
    folders.length === 1
      ? folders[0]
      : await vscode.window.showWorkspaceFolderPick({ placeHolder: vscode.l10n.t("Which project folder?") });
  if (!folder) {
    return;
  }

  const target = vscode.Uri.joinPath(folder.uri, ...TARGET);
  let exists = false;
  try {
    await vscode.workspace.fs.stat(target);
    exists = true;
  } catch {
    exists = false;
  }
  if (exists) {
    const overwrite = vscode.l10n.t("Overwrite");
    const open = vscode.l10n.t("Open existing file");
    const choice = await vscode.window.showWarningMessage(
      vscode.l10n.t("{0} already exists.", ".github/copilot-instructions.md"),
      overwrite,
      open,
    );
    if (choice === open) {
      await vscode.window.showTextDocument(target);
      return;
    }
    if (choice !== overwrite) {
      return;
    }
  }

  const template = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(context.extensionUri, ...TEMPLATE));
  await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(folder.uri, TARGET[0]));
  await vscode.workspace.fs.writeFile(target, template);
  await vscode.window.showTextDocument(target);
  void vscode.window.showInformationMessage(
    vscode.l10n.t("Created {0}. GitHub Copilot now knows how to write Ekips Prime Pro.", ".github/copilot-instructions.md"),
  );
}
