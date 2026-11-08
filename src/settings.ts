// Typed access to the extension settings.
import * as vscode from "vscode";
import { resolveExecutable, ResolveResult } from "./binary";

export const TOOLS_URL = "https://github.com/Ekips-Prime-Pro/Ekips-Prime-Pro-Tools";

export type MessageLanguage = "en" | "de";

function config(): vscode.WorkspaceConfiguration {
  return vscode.workspace.getConfiguration("ekips");
}

function baseDir(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

export function lspEnabled(): boolean {
  return config().get<boolean>("lsp.enabled", true);
}

export function resolveLsp(): ResolveResult {
  return resolveExecutable("ekips-lsp", { configured: config().get<string>("lsp.path", ""), baseDir: baseDir() });
}

export function resolveCli(): ResolveResult {
  return resolveExecutable("ekips", { configured: config().get<string>("cli.path", ""), baseDir: baseDir() });
}

/** Language of compiler messages: the setting, or the VS Code display language. */
export function messageLanguage(): MessageLanguage {
  const setting = config().get<string>("messages.language", "auto");
  if (setting === "en" || setting === "de") {
    return setting;
  }
  return vscode.env.language.toLowerCase().startsWith("de") ? "de" : "en";
}
