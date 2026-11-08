// Checks the static contributions: snippets and language configuration.
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const readJson = (file: string): unknown => JSON.parse(readFileSync(join(root, file), "utf8"));

interface Snippet {
  prefix: string | string[];
  body: string | string[];
  description: string;
}

/** Expands a snippet body the way VS Code would if the user accepts all defaults. */
function expand(body: string): string {
  const defaults = new Map<string, string>();
  let text = body.replace(/\$\{(\d+)\|([^|]*)\|\}/g, (_m, n: string, choices: string) => {
    const first = choices.split(",")[0];
    defaults.set(n, first);
    return first;
  });
  text = text.replace(/\$\{(\d+):([^}]*)\}/g, (_m, n: string, value: string) => {
    if (!defaults.has(n)) {
      defaults.set(n, value);
    }
    return value;
  });
  text = text.replace(/\$\{(\d+)\}/g, (_m, n: string) => defaults.get(n) ?? "");
  return text.replace(/\$\d+/g, "");
}

function bracketsBalanced(text: string): boolean {
  const pairs: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const stack: string[] = [];
  for (const ch of text) {
    if ("([{".includes(ch)) {
      stack.push(ch);
    } else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}

describe("snippets", () => {
  const snippets = readJson("snippets/ekips.code-snippets") as Record<string, Snippet>;
  const expanded = (name: string): string => {
    const body = snippets[name].body;
    return expand(Array.isArray(body) ? body.join("\n") : body);
  };

  it("every snippet has a prefix, a body and a description", () => {
    for (const [name, s] of Object.entries(snippets)) {
      assert.ok(s.prefix && s.prefix.length > 0, `${name}: prefix`);
      assert.ok(s.body && s.body.length > 0, `${name}: body`);
      assert.ok(s.description, `${name}: description`);
    }
  });

  it("every snippet expands to code with balanced brackets", () => {
    for (const name of Object.keys(snippets)) {
      assert.ok(bracketsBalanced(expanded(name)), name);
    }
  });

  it("contains the required snippets", () => {
    const prefixes = Object.values(snippets).flatMap((s) => [s.prefix].flat());
    for (const p of ["main", "function", "async function", "for", "forof", "if", "ifelse", "driveuntilline", "setup"]) {
      assert.ok(prefixes.includes(p), `missing prefix ${p}`);
    }
  });

  it("main snippet declares async function main()", () => {
    assert.match(expanded("Main function"), /async function main\(\) \{/);
  });

  it("drive-until-line snippet races drive against waitUntil and stops", () => {
    const code = expanded("Drive until line");
    assert.match(code, /await Promise\.race\(\[/);
    assert.match(code, /robot\.drive\(100cm, 40%\)/);
    assert.match(code, /waitUntil\(\(\) => eye\.sees\(Color\.Black\)\)/);
    assert.match(code, /robot\.stop\(\);/);
  });

  it("setup snippet creates motors on ports and a drive base", () => {
    const code = expanded("Setup: motors and drive base");
    assert.match(code, /new Motor\(Port\.A\)/);
    assert.match(code, /new Motor\(Port\.B\)/);
    assert.match(code, /new DriveBase\(leftWheel, rightWheel, 56mm, 112mm\)/);
  });
});

describe("language configuration", () => {
  const config = readJson("language-configuration.json") as {
    comments: { lineComment: string; blockComment: [string, string] };
    wordPattern: string;
    indentationRules: { increaseIndentPattern: string; decreaseIndentPattern: string };
  };

  it("uses // and /* */ comments", () => {
    assert.equal(config.comments.lineComment, "//");
    assert.deepEqual(config.comments.blockComment, ["/*", "*/"]);
  });

  it("treats numbers with units as one word", () => {
    const re = new RegExp(config.wordPattern, "g");
    assert.deepEqual("drive(20cm, 1.5rot, 90°, 50%)".match(re), ["drive", "20cm", "1.5rot", "90°", "50%"]);
  });

  it("indents after an opening brace and outdents on a closing one", () => {
    const inc = new RegExp(config.indentationRules.increaseIndentPattern);
    const dec = new RegExp(config.indentationRules.decreaseIndentPattern);
    assert.ok(inc.test("async function main() {"));
    assert.ok(inc.test("await Promise.race(["));
    assert.ok(!inc.test("// comment {"));
    assert.ok(!inc.test("robot.stop();"));
    assert.ok(dec.test("  }"));
    assert.ok(dec.test("]);"));
  });
});

describe("copilot instructions template", () => {
  const template = readFileSync(join(root, "templates/copilot-instructions.md"), "utf8");

  it("mentions the entry point and every unit", () => {
    assert.match(template, /async function main\(\)/);
    for (const unit of ["mm", "cm", "deg", "°", "rot", "s", "ms", "%"]) {
      assert.ok(template.includes(`\`${unit}\``), `unit ${unit}`);
    }
  });

  it("only uses units of the language in its code examples", () => {
    const code = [...template.matchAll(/```ts\n([\s\S]*?)```/g)].map((m) => m[1]).join("\n");
    assert.ok(code.length > 0);
    // Strip comments, then look for numbers followed by letters.
    const withoutComments = code.replace(/\/\/.*$/gm, "");
    const suffixes = [...withoutComments.matchAll(/(?<![\w.])\d+(?:\.\d+)?([A-Za-z]+)/g)].map((m) => m[1]);
    const unknown = suffixes.filter((s) => !["mm", "cm", "deg", "rot", "s", "ms"].includes(s));
    assert.deepEqual(unknown, []);
  });
});
