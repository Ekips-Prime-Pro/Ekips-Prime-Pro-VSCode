// Every user-visible string must exist in English (source) and German (bundle).
import { strict as assert } from "node:assert";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const readJson = (file: string): Record<string, string> => JSON.parse(readFileSync(join(root, file), "utf8"));

/** Collects the first string argument of every vscode.l10n.t("...") call in src/. */
function sourceStrings(): Set<string> {
  const strings = new Set<string>();
  const call = /l10n\.t\(\s*"((?:[^"\\]|\\.)*)"/g;
  for (const file of readdirSync(join(root, "src"))) {
    if (!file.endsWith(".ts")) {
      continue;
    }
    const text = readFileSync(join(root, "src", file), "utf8");
    for (const match of text.matchAll(call)) {
      strings.add(JSON.parse(`"${match[1]}"`) as string);
    }
  }
  return strings;
}

describe("localization", () => {
  it("has a German translation for every runtime string", () => {
    const bundle = readJson("l10n/bundle.l10n.de.json");
    const missing = [...sourceStrings()].filter((s) => !(s in bundle));
    assert.deepEqual(missing, []);
  });

  it("has no unused German translations", () => {
    const used = sourceStrings();
    const unused = Object.keys(readJson("l10n/bundle.l10n.de.json")).filter((s) => !used.has(s));
    assert.deepEqual(unused, []);
  });

  it("keeps placeholders in translations", () => {
    for (const [en, de] of Object.entries(readJson("l10n/bundle.l10n.de.json"))) {
      const placeholders = (s: string): string[] => (s.match(/\{\d+\}/g) ?? []).sort();
      assert.deepEqual(placeholders(de), placeholders(en), en);
    }
  });

  it("translates every %key% used in package.json into English and German", () => {
    const manifest = readFileSync(join(root, "package.json"), "utf8");
    const keys = [...manifest.matchAll(/"%([\w.]+)%"/g)].map((m) => m[1]);
    assert.ok(keys.length > 0);
    for (const file of ["package.nls.json", "package.nls.de.json"]) {
      const nls = readJson(file);
      assert.deepEqual(keys.filter((k) => !(k in nls)), [], file);
      assert.deepEqual(Object.keys(nls).filter((k) => !keys.includes(k)), [], `${file}: unused keys`);
    }
  });
});
