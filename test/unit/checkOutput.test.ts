import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { parseCheckOutput } from "../../src/checkOutput";

describe("parseCheckOutput", () => {
  it("parses an English error with hint and caret length", () => {
    const output = [
      "error: This text is missing its closing quote.",
      " --> examples/main.ekips:3:12",
      "  |",
      "3 |   hub.show(\"Hi);",
      "  |            ^^^^",
      "  = help: Add `\"` at the end of the text.",
      "",
      "examples/main.ekips: 1 problem(s)",
    ].join("\n");
    assert.deepEqual(parseCheckOutput(output), [
      {
        severity: "error",
        message: "This text is missing its closing quote.",
        file: "examples/main.ekips",
        line: 3,
        column: 12,
        length: 4,
        hint: "Add `\"` at the end of the text.",
      },
    ]);
  });

  it("parses several German problems, with and without hint", () => {
    const output = [
      "Fehler: Das Zeichen `#` verstehe ich nicht.",
      "  --> C:\\robot\\main.ekips:12:5",
      "   |",
      "12 |     # x",
      "   |     ^",
      "Warnung: Etwas stimmt nicht.",
      "  --> C:\\robot\\main.ekips:14:1",
      "   |",
      "14 | foo",
      "   | ^^^",
      "   = Hilfe: Probier es anders.",
    ].join("\r\n");
    const problems = parseCheckOutput(output);
    assert.equal(problems.length, 2);
    assert.equal(problems[0].severity, "error");
    assert.equal(problems[0].file, "C:\\robot\\main.ekips");
    assert.equal(problems[0].line, 12);
    assert.equal(problems[0].column, 5);
    assert.equal(problems[0].length, 1);
    assert.equal(problems[0].hint, undefined);
    assert.equal(problems[1].severity, "warning");
    assert.equal(problems[1].length, 3);
    assert.equal(problems[1].hint, "Probier es anders.");
  });

  it("returns nothing for a clean file", () => {
    assert.deepEqual(parseCheckOutput("main.ekips: OK\n"), []);
  });

  it("ignores a header without location", () => {
    assert.deepEqual(parseCheckOutput("error: something\nmore text\n"), []);
  });
});
