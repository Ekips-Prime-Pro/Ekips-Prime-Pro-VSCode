// Starts the Ekips language server (ekips-lsp) with vscode-languageclient.
import * as vscode from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, State, TransportKind } from "vscode-languageclient/node";
import { lspEnabled, messageLanguage, resolveLsp, TOOLS_URL } from "./settings";
import { EkipsStatusBar } from "./statusBar";

const HIDE_MISSING_KEY = "ekips.lsp.hideMissingWarning";

export class EkipsLanguageServer implements vscode.Disposable {
  private client: LanguageClient | undefined;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly output: vscode.OutputChannel,
    private readonly status: EkipsStatusBar,
  ) {}

  /**
   * Starts the server if it is enabled and can be found. Never throws.
   * @param explicit true if the user asked for it (shows the "not found" message even if hidden).
   */
  async start(explicit = false): Promise<void> {
    if (!lspEnabled()) {
      this.status.setServerState("disabled");
      return;
    }

    const resolved = resolveLsp();
    if (!resolved.found) {
      this.status.setServerState("missing");
      const detail =
        resolved.reason === "configuredMissing"
          ? vscode.l10n.t("The file set in \"ekips.lsp.path\" does not exist or is not executable: {0}", resolved.path)
          : vscode.l10n.t("The program \"ekips-lsp\" was not found on this computer.");
      this.output.appendLine(`[lsp] ${detail}`);
      // Do not await: the message must not block extension activation.
      void this.showMissingMessage(detail, explicit);
      return;
    }

    this.output.appendLine(`[lsp] starting ${resolved.path}`);
    this.status.setServerState("starting");

    const serverOptions: ServerOptions = {
      run: { command: resolved.path, transport: TransportKind.stdio },
      debug: { command: resolved.path, transport: TransportKind.stdio },
    };
    const clientOptions: LanguageClientOptions = {
      documentSelector: [{ language: "ekips" }],
      outputChannel: this.output,
      initializationOptions: { language: messageLanguage() },
      synchronize: { fileEvents: vscode.workspace.createFileSystemWatcher("**/*.ekips") },
    };

    const client = new LanguageClient("ekips", "Ekips Prime Pro Language Server", serverOptions, clientOptions);
    client.onDidChangeState((e) => {
      if (e.newState === State.Running) {
        this.status.setServerState("running");
      } else if (e.newState === State.Stopped) {
        this.status.setServerState("stopped");
      }
    });
    this.client = client;

    try {
      await client.start();
    } catch (err) {
      this.status.setServerState("error");
      const message = err instanceof Error ? err.message : String(err);
      this.output.appendLine(`[lsp] failed to start: ${message}`);
      void vscode.window.showErrorMessage(
        vscode.l10n.t("The Ekips language server could not be started: {0}", message),
      );
    }
  }

  async stop(): Promise<void> {
    const client = this.client;
    this.client = undefined;
    if (client) {
      try {
        await client.stop();
      } catch (err) {
        this.output.appendLine(`[lsp] error while stopping: ${String(err)}`);
      }
    }
  }

  async restart(explicit = false): Promise<void> {
    await this.stop();
    await this.start(explicit);
  }

  private async showMissingMessage(detail: string, explicit: boolean): Promise<void> {
    if (!explicit && this.context.globalState.get<boolean>(HIDE_MISSING_KEY)) {
      return;
    }
    const openSettings = vscode.l10n.t("Set path");
    const download = vscode.l10n.t("Get Ekips Tools");
    const dontShow = vscode.l10n.t("Don't show again");
    const choice = await vscode.window.showWarningMessage(
      `${detail} ${vscode.l10n.t(
        "Syntax colours and snippets still work, but error checking, autocomplete and hover help need the Ekips language server. Install Ekips Prime Pro Tools or set the path in the setting \"ekips.lsp.path\".",
      )}`,
      openSettings,
      download,
      dontShow,
    );
    if (choice === openSettings) {
      await vscode.commands.executeCommand("workbench.action.openSettings", "ekips.lsp.path");
    } else if (choice === download) {
      await vscode.env.openExternal(vscode.Uri.parse(TOOLS_URL));
    } else if (choice === dontShow) {
      await this.context.globalState.update(HIDE_MISSING_KEY, true);
    }
  }

  dispose(): void {
    void this.stop();
  }
}
