import ts from "typescript";
import fs from "fs";
import path from "path";
import { Traverser, Validator } from "../services/";
import { LINTINGS } from "../lintings";
import { lintIssueIsDisabled } from "../utils";

export const transpile = (validator: Validator, sourceFilePath: string) => {
  const source = fs.readFileSync(sourceFilePath, "utf8");

  ts.transpileModule(source.toString(), {
    transformers: { before: [Traverser.traverse(validator)] },
  });
};

export const runTest = (validator: Validator) => (linting: Linting) => {
  test(linting.message, () => {
    const found = validator.logs.find((log) => log.message === linting.message);

    if (lintIssueIsDisabled(linting.lintIssue)) return;

    expect(found).toBeDefined();
  });
};

export const buildSourceFilePath = (lintArea: LintArea) =>
  path.join("src", "tests", "input", `${lintArea}.ts`);

const groupByLintArea = (list: Linting[]) =>
  list.reduce<{ [key: string]: Linting[] }>((acc, linting) => {
    linting.lintAreas.forEach((lintArea) => {
      const accLintArea = acc[lintArea] ?? [];
      accLintArea.push(linting);
      acc[lintArea] = accLintArea;
    });

    return acc;

    // const lintArea = lintAreas[linting.lintArea] ?? [];
    // lintArea.push(linting);
    // lintAreas[linting.lintArea] = lintArea;
    // return lintAreas;
  }, {});

export const lintingsByGroup = groupByLintArea(Object.values(LINTINGS));
