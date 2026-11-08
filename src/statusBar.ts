// Status bar entry that shows the language server state and opens the Ekips menu.
import * as vscode from "vscode";

export type ServerState = "starting" | "running" | "missing" | "disabled" | "stopped" | "error";

export class EkipsStatusBar implements vscode.Disposable {
  private readonly item: vscode.StatusBarItem;
  private readonly subscriptions: vscode.Disposable[] = [];

  constructor() {
    this.item = vscode.window.createStatusBarItem("ekips.status", vscode.StatusBarAlignment.Left, 100);
    this.item.name = "Ekips Prime Pro";
    this.item.command = "ekips.showMenu";
    this.setServerState("starting");
    this.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => this.updateVisibility()));
    this.updateVisibility();
  }

  setServerState(state: ServerState): void {
    const texts: Record<ServerState, { icon: string; tooltip: string; warn: boolean }> = {
      starting: { icon: "$(loading~spin)", tooltip: vscode.l10n.t("Language server is starting…"), warn: false },
      running: { icon: "$(check)", tooltip: vscode.l10n.t("Language server is running"), warn: false },
      missing: { icon: "$(warning)", tooltip: vscode.l10n.t("Language server ekips-lsp not found"), warn: true },
      disabled: { icon: "$(circle-slash)", tooltip: vscode.l10n.t("Language server is turned off"), warn: false },
      stopped: { icon: "$(debug-stop)", tooltip: vscode.l10n.t("Language server stopped"), warn: true },
      error: { icon: "$(error)", tooltip: vscode.l10n.t("Language server failed to start"), warn: true },
    };
    const t = texts[state];
    this.item.text = `${t.icon} Ekips`;
    this.item.tooltip = `Ekips Prime Pro – ${t.tooltip}\n${vscode.l10n.t("Click for Ekips commands")}`;
    this.item.backgroundColor = t.warn ? new vscode.ThemeColor("statusBarItem.warningBackground") : undefined;
  }

  private updateVisibility(): void {
    if (vscode.window.activeTextEditor?.document.languageId === "ekips") {
      this.item.show();
    } else {
      this.item.hide();
    }
  }

  dispose(): void {
    this.item.dispose();
    for (const s of this.subscriptions) {
      s.dispose();
    }
  }
}
