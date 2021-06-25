import ts from "typescript";
import fs from "fs";
import path from "path";
import { Traverser, Validator } from "../services";
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
    const loggedError = validator.logs.find(
      (loggedError) => loggedError.message === linting.message
    );

    if (lintIssueIsDisabled(linting.lintIssue)) return;

    expect(loggedError).toBeDefined();
  });
};

export const buildSourceFilePath = (lintArea: LintArea) =>
  path.join("src", "tests", "input", `${lintArea}.ts`);

const groupByLintArea = (list: Linting[]) =>
  list.reduce<{ [key: string]: Linting[] }>((lintAreas, linting) => {
    const lintArea = lintAreas[linting.lintArea] ?? [];
    lintArea.push(linting);
    lintAreas[linting.lintArea] = lintArea;
    return lintAreas;
  }, {});

export const lintingsByGroup = groupByLintArea(Object.values(LINTINGS));
