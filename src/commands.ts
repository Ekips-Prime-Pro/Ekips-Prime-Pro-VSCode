// Registers all commands of the extension.
import * as vscode from "vscode";
import { checkFile } from "./cli";
import { createCopilotInstructions } from "./copilot";
import { EkipsLanguageServer } from "./lsp";
import { TOOLS_URL } from "./settings";

async function comingSoon(feature: string): Promise<void> {
  const learnMore = vscode.l10n.t("Learn more");
  const choice = await vscode.window.showInformationMessage(
    vscode.l10n.t("{0} is not available yet. It will come with Ekips Prime Pro Tools.", feature),
    learnMore,
  );
  if (choice === learnMore) {
    await vscode.env.openExternal(vscode.Uri.parse(TOOLS_URL));
  }
}

async function showMenu(): Promise<void> {
  interface MenuItem extends vscode.QuickPickItem {
    command: string;
  }
  const items: MenuItem[] = [
    { label: `$(check) ${vscode.l10n.t("Check File")}`, command: "ekips.checkFile" },
    { label: `$(play) ${vscode.l10n.t("Simulate")}`, command: "ekips.simulate" },
    { label: `$(cloud-upload) ${vscode.l10n.t("Upload to Hub")}`, command: "ekips.uploadToHub" },
    { label: `$(debug-restart) ${vscode.l10n.t("Restart Language Server")}`, command: "ekips.restartLanguageServer" },
    { label: `$(copilot) ${vscode.l10n.t("Add Copilot Instructions to Project")}`, command: "ekips.createCopilotInstructions" },
    { label: `$(gear) ${vscode.l10n.t("Settings")}`, command: "ekips.openSettings" },
  ];
  const picked = await vscode.window.showQuickPick(items, { placeHolder: "Ekips Prime Pro" });
  if (picked) {
    await vscode.commands.executeCommand(picked.command);
  }
}

export function registerCommands(
  context: vscode.ExtensionContext,
  server: EkipsLanguageServer,
  diagnostics: vscode.DiagnosticCollection,
  output: vscode.OutputChannel,
): void {
  const register = (id: string, fn: (...args: never[]) => unknown): void => {
    context.subscriptions.push(vscode.commands.registerCommand(id, fn));
  };
  register("ekips.checkFile", (uri?: vscode.Uri) => checkFile(diagnostics, output, uri));
  register("ekips.simulate", () => comingSoon(vscode.l10n.t("Simulation")));
  register("ekips.uploadToHub", () => comingSoon(vscode.l10n.t("Uploading to the hub")));
  register("ekips.restartLanguageServer", () => server.restart(true));
  register("ekips.createCopilotInstructions", () => createCopilotInstructions(context));
  register("ekips.showMenu", showMenu);
  register("ekips.openSettings", () =>
    vscode.commands.executeCommand("workbench.action.openSettings", "@ext:ekips-prime-pro.ekips-prime-pro"),
  );
}
