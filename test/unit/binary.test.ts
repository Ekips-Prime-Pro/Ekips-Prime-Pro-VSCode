import { strict as assert } from "node:assert";
import { chmodSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { resolveExecutable } from "../../src/binary";

const posixOnly = process.platform === "win32" ? { skip: "POSIX file modes" } : {};

function makeBin(dir: string, name: string, executable = true): string {
  const file = join(dir, name);
  writeFileSync(file, "#!/bin/sh\n");
  chmodSync(file, executable ? 0o755 : 0o644);
  return file;
}

describe("resolveExecutable", posixOnly, () => {
  const dir = mkdtempSync(join(tmpdir(), "ekips-bin-"));
  const lsp = makeBin(dir, "ekips-lsp");
  makeBin(dir, "not-executable", false);

  it("finds a program on the PATH", () => {
    const result = resolveExecutable("ekips-lsp", { env: { PATH: dir } });
    assert.deepEqual(result, { found: true, path: lsp });
  });

  it("uses a configured absolute path", () => {
    const result = resolveExecutable("ekips-lsp", { configured: lsp, env: { PATH: "" } });
    assert.deepEqual(result, { found: true, path: lsp });
  });

  it("resolves a configured relative path against the base folder", () => {
    const result = resolveExecutable("ekips-lsp", { configured: "./ekips-lsp", baseDir: dir, env: {} });
    assert.deepEqual(result, { found: true, path: lsp });
  });

  it("reports a configured path that does not exist", () => {
    const missing = join(dir, "missing");
    const result = resolveExecutable("ekips-lsp", { configured: missing, env: { PATH: dir } });
    assert.deepEqual(result, { found: false, reason: "configuredMissing", path: missing });
  });

  it("does not accept files that are not executable", () => {
    const result = resolveExecutable("not-executable", { env: { PATH: dir } });
    assert.equal(result.found, false);
  });

  it("searches a configured bare name on the PATH", () => {
    const result = resolveExecutable("ekips", { configured: "ekips-lsp", env: { PATH: dir } });
    assert.deepEqual(result, { found: true, path: lsp });
  });

  it("reports a program that is not on the PATH", () => {
    const result = resolveExecutable("ekips-lsp-does-not-exist", { env: { PATH: dir } });
    assert.deepEqual(result, { found: false, reason: "notOnPath" });
  });
});
