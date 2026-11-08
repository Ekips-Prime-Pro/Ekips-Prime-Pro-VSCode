import * as vscode from "vscode";
import { registerCommands } from "./commands";
import { EkipsLanguageServer } from "./lsp";
import { EkipsStatusBar } from "./statusBar";

let server: EkipsLanguageServer | undefined;

/** Called by VS Code when the extension is activated. */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const output = vscode.window.createOutputChannel("Ekips Prime Pro");
  const status = new EkipsStatusBar();
  const diagnostics = vscode.languages.createDiagnosticCollection("ekips-check");
  server = new EkipsLanguageServer(context, output, status);
  context.subscriptions.push(output, status, diagnostics, server);

  registerCommands(context, server, diagnostics, output);

  // Remove results of "Ekips: Check File" as soon as the file changes or closes.
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.contentChanges.length > 0) {
        diagnostics.delete(e.document.uri);
      }
    }),
    vscode.workspace.onDidCloseTextDocument((doc) => diagnostics.delete(doc.uri)),
  );

  // Restart the language server when its settings change.
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration("ekips.lsp.path") ||
        e.affectsConfiguration("ekips.lsp.enabled") ||
        e.affectsConfiguration("ekips.messages.language")
      ) {
        void server?.restart();
      }
    }),
  );

  await server.start();
}

/** Called by VS Code when the extension is deactivated. */
export async function deactivate(): Promise<void> {
  await server?.stop();
  server = undefined;
}
