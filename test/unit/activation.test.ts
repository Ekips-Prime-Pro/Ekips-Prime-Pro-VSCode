// Loads the bundled extension (dist/extension.js) with a minimal fake "vscode"
// module and checks activation when ekips-lsp is missing.
import { strict as assert } from "node:assert";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import Module from "node:module";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

interface FakeState {
  commands: Map<string, (...args: unknown[]) => unknown>;
  warnings: string[];
  infos: string[];
  statusTexts: string[];
  settings: Record<string, unknown>;
  /** Document returned as the active editor's document. */
  document?: unknown;
  /** Diagnostics set by the extension, per file path. */
  diagnostics: Map<string, { message: string; severity: number; range: unknown }[]>;
}

/** Returns an object that accepts any property access or call (for APIs the test does not care about). */
function anything(): unknown {
  const fn = function () {
    return anything();
  };
  return new Proxy(fn, {
    get: (_target, prop) => (prop === "then" ? undefined : prop === "dispose" ? () => undefined : anything()),
  });
}

function fakeVscode(state: FakeState): unknown {
  const disposable = { dispose: () => undefined };
  const event = () => disposable;
  const l10n = {
    t: (message: string, ...args: unknown[]) => message.replace(/\{(\d+)\}/g, (_m, i: string) => String(args[Number(i)])),
  };
  const api = {
    l10n,
    StatusBarAlignment: { Left: 1, Right: 2 },
    DiagnosticSeverity: { Error: 0, Warning: 1, Information: 2, Hint: 3 },
    ProgressLocation: { Window: 10 },
    Range: class {
      constructor(
        public startLine: number,
        public startCharacter: number,
        public endLine: number,
        public endCharacter: number,
      ) {}
    },
    Diagnostic: class {
      source = "";
      constructor(
        public range: unknown,
        public message: string,
        public severity: number,
      ) {}
    },
    ThemeColor: class {
      constructor(public id: string) {}
    },
    Uri: { parse: (s: string) => ({ toString: () => s }), joinPath: () => ({}) },
    env: { language: "en", openExternal: async () => true },
    window: {
      get activeTextEditor() {
        return { document: state.document ?? { languageId: "ekips" } };
      },
      withProgress: async (_options: unknown, task: () => Promise<unknown>) => task(),
      createOutputChannel: () => ({ appendLine: () => undefined, append: () => undefined, show: () => undefined, dispose: () => undefined }),
      createStatusBarItem: () => {
        const item = {
          _text: "",
          get text() {
            return this._text;
          },
          set text(value: string) {
            this._text = value;
            state.statusTexts.push(value);
          },
          show: () => undefined,
          hide: () => undefined,
          dispose: () => undefined,
        };
        return item;
      },
      onDidChangeActiveTextEditor: event,
      showWarningMessage: async (message: string) => {
        state.warnings.push(message);
        return undefined;
      },
      showInformationMessage: async (message: string) => {
        state.infos.push(message);
        return undefined;
      },
      showErrorMessage: async () => undefined,
    },
    workspace: {
      workspaceFolders: undefined,
      getConfiguration: () => ({
        get: <T>(key: string, fallback: T): T => (key in state.settings ? (state.settings[key] as T) : fallback),
      }),
      onDidChangeTextDocument: event,
      onDidCloseTextDocument: event,
      onDidChangeConfiguration: event,
      createFileSystemWatcher: () => disposable,
    },
    languages: {
      createDiagnosticCollection: () => ({
        set: (uri: { fsPath: string }, list: { message: string; severity: number; range: unknown }[]) =>
          state.diagnostics.set(uri.fsPath, list),
        delete: () => undefined,
        dispose: () => undefined,
      }),
    },
    commands: {
      registerCommand: (id: string, fn: (...args: unknown[]) => unknown) => {
        state.commands.set(id, fn);
        return disposable;
      },
      executeCommand: async () => undefined,
    },
  };
  return new Proxy(api, { get: (target, prop) => (prop in target ? target[prop as keyof typeof target] : anything()) });
}

async function activate(
  settings: Record<string, unknown>,
  env: Record<string, string>,
  run?: (state: FakeState) => Promise<void>,
): Promise<FakeState> {
  const state: FakeState = { commands: new Map(), warnings: [], infos: [], statusTexts: [], settings, diagnostics: new Map() };
  const moduleApi = Module as unknown as { _load: (request: string, ...rest: unknown[]) => unknown };
  const originalLoad = moduleApi._load;
  const originalPath = process.env.PATH;
  moduleApi._load = (request: string, ...rest: unknown[]) =>
    request === "vscode" ? fakeVscode(state) : originalLoad(request, ...rest);
  process.env.PATH = env.PATH;
  try {
    const file = join(root, "dist", "extension.js");
    const load = Module.createRequire(__filename);
    delete load.cache[file];
    const extension = load(file) as { activate: (ctx: unknown) => Promise<void>; deactivate: () => Promise<void> };
    const context = {
      subscriptions: [] as unknown[],
      globalState: { get: () => undefined, update: async () => undefined },
      extensionUri: {},
    };
    await extension.activate(context);
    await new Promise((resolve) => setImmediate(resolve));
    await run?.(state);
    await extension.deactivate();
  } finally {
    moduleApi._load = originalLoad;
    process.env.PATH = originalPath;
  }
  return state;
}

describe("activation (bundled extension with fake vscode)", () => {
  it("registers every command declared in package.json", async () => {
    const state = await activate({ "lsp.path": "/does/not/exist/ekips-lsp" }, { PATH: "" });
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      contributes: { commands: { command: string }[] };
    };
    const declared = manifest.contributes.commands.map((c) => c.command).sort();
    assert.deepEqual([...state.commands.keys()].sort(), declared);
  });

  it("explains a missing ekips-lsp instead of failing", async () => {
    const state = await activate({ "lsp.path": "/does/not/exist/ekips-lsp" }, { PATH: "" });
    assert.equal(state.warnings.length, 1);
    assert.match(state.warnings[0], /ekips\.lsp\.path/);
    assert.match(state.warnings[0], /\/does\/not\/exist\/ekips-lsp/);
    assert.match(state.statusTexts.at(-1) ?? "", /\$\(warning\) Ekips/);
  });

  it("does not start or warn when the language server is turned off", async () => {
    const state = await activate({ "lsp.enabled": false }, { PATH: "" });
    assert.deepEqual(state.warnings, []);
    assert.match(state.statusTexts.at(-1) ?? "", /\$\(circle-slash\) Ekips/);
  });

  it("shows a placeholder message for Simulate and Upload to Hub", async () => {
    const state = await activate({ "lsp.enabled": false }, { PATH: "" });
    await state.commands.get("ekips.simulate")?.();
    await state.commands.get("ekips.uploadToHub")?.();
    assert.equal(state.infos.length, 2);
    assert.match(state.infos[0], /not available yet/);
  });
});

describe("Ekips: Check File (with a fake ekips program)", { skip: process.platform === "win32" ? "POSIX shell script" : false }, () => {
  const dir = mkdtempSync(join(tmpdir(), "ekips-check-"));
  const file = join(dir, "main.ekips");
  writeFileSync(file, 'async function main() {\n  hub.show("Hi);\n}\n');
  const cli = join(dir, "ekips");
  // Prints a problem in the compiler's format; records the arguments it got.
  writeFileSync(
    cli,
    [
      "#!/bin/sh",
      `echo "$@" > "${dir}/args.txt"`,
      'echo "Fehler: Diesem Text fehlt das schließende Anführungszeichen." >&2',
      `echo " --> ${file}:2:12" >&2`,
      'echo "  |" >&2',
      "echo '2 |   hub.show(\"Hi);' >&2",
      'echo "  |            ^^^^" >&2',
      'echo "  = Hilfe: Setze ein Anführungszeichen ans Ende." >&2',
      "exit 1",
      "",
    ].join("\n"),
  );
  chmodSync(cli, 0o755);

  it("runs ekips check and reports the problem as a diagnostic", async () => {
    const state = await activate(
      { "lsp.enabled": false, "cli.path": cli, "messages.language": "de" },
      { PATH: "" },
      async (s) => {
        s.document = { languageId: "ekips", isUntitled: false, isDirty: false, uri: { fsPath: file } };
        await s.commands.get("ekips.checkFile")?.();
      },
    );
    assert.equal(readFileSync(join(dir, "args.txt"), "utf8").trim(), `check --de ${file}`);
    const list = state.diagnostics.get(file) ?? [];
    assert.equal(list.length, 1);
    assert.equal(list[0].severity, 0);
    assert.match(list[0].message, /Anführungszeichen\.\nSetze ein/);
    assert.deepEqual({ ...(list[0].range as object) }, { startLine: 1, startCharacter: 11, endLine: 1, endCharacter: 15 });
    assert.match(state.warnings[0], /1 problem\(s\) found/);
  });
});
