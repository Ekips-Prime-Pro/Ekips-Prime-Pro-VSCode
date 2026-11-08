// Finds executables (ekips, ekips-lsp) from a setting or the PATH.
// This module must not import "vscode" so it can be unit-tested with plain Node.
import { accessSync, constants, statSync } from "node:fs";
import { homedir } from "node:os";
import * as path from "node:path";

export interface ResolveOptions {
  /** Value of the user setting (may be empty). */
  configured?: string;
  /** Environment used for PATH / PATHEXT lookup. */
  env?: NodeJS.ProcessEnv;
  /** Platform, defaults to the current one. */
  platform?: NodeJS.Platform;
  /** Folder used to resolve relative configured paths (first workspace folder). */
  baseDir?: string;
}

export type ResolveResult =
  | { found: true; path: string }
  | { found: false; reason: "configuredMissing"; path: string }
  | { found: false; reason: "notOnPath" };

function isExecutableFile(file: string, platform: NodeJS.Platform): boolean {
  try {
    if (!statSync(file).isFile()) {
      return false;
    }
    if (platform !== "win32") {
      accessSync(file, constants.X_OK);
    }
    return true;
  } catch {
    return false;
  }
}

/** Expands a leading "~" to the home directory. */
export function expandHome(p: string): string {
  if (p === "~") {
    return homedir();
  }
  if (p.startsWith("~/") || p.startsWith("~\\")) {
    return path.join(homedir(), p.slice(2));
  }
  return p;
}

function candidates(base: string, env: NodeJS.ProcessEnv, platform: NodeJS.Platform): string[] {
  if (platform !== "win32" || path.extname(base) !== "") {
    return [base];
  }
  const exts = (env.PATHEXT ?? ".EXE;.CMD;.BAT").split(";").filter((e) => e.length > 0);
  return [base, ...exts.map((ext) => base + ext.toLowerCase()), ...exts.map((ext) => base + ext)];
}

/**
 * Resolves an executable.
 *
 * - If a path is configured, only that path is used (relative paths are
 *   resolved against `baseDir`). A configured bare name such as "ekips-lsp"
 *   is searched on the PATH.
 * - Otherwise `name` is searched on the PATH and in `~/.cargo/bin`
 *   (where `cargo install` puts the Ekips tools).
 */
export function resolveExecutable(name: string, options: ResolveOptions = {}): ResolveResult {
  const env = options.env ?? process.env;
  const platform = options.platform ?? process.platform;
  const pathApi = platform === "win32" ? path.win32 : path.posix;
  const configured = options.configured?.trim() ?? "";

  const looksLikePath = /[\\/]/.test(configured) || configured.startsWith("~");
  if (looksLikePath) {
    let file = expandHome(configured);
    if (!pathApi.isAbsolute(file) && options.baseDir) {
      file = pathApi.resolve(options.baseDir, file);
    }
    for (const candidate of candidates(file, env, platform)) {
      if (isExecutableFile(candidate, platform)) {
        return { found: true, path: candidate };
      }
    }
    return { found: false, reason: "configuredMissing", path: file };
  }

  const program = configured !== "" ? configured : name;
  const dirs = (env.PATH ?? env.Path ?? "").split(pathApi.delimiter).filter((d) => d.length > 0);
  dirs.push(pathApi.join(homedir(), ".cargo", "bin"));
  for (const dir of dirs) {
    for (const candidate of candidates(pathApi.join(dir, program), env, platform)) {
      if (isExecutableFile(candidate, platform)) {
        return { found: true, path: candidate };
      }
    }
  }
  return { found: false, reason: "notOnPath" };
}
