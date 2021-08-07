import ts from "typescript";
import fs from "fs";
import path from "path";
import { Traverser, Validator } from "../../services";
import { LINTINGS } from "../../lintings";
import { defaultConfig } from "../../defaultConfig";
import { lintingIsDisabled, lintIssueIsDisabled } from "../../utils";
import { masterConfig } from "../..";

export const transpile = (validator: Validator, sourceFilePath: string) => {
  const source = fs.readFileSync(sourceFilePath, "utf8");

  ts.transpileModule(source.toString(), {
    transformers: { before: [Traverser.traverse(validator)] },
  });
};

export const runTest = (validator: Validator) => (linting: Linting) => {
  test(linting.message, () => {
    const found = validator.logs.find((log) => log.message === linting.message);

    if (lintIssueIsDisabled(linting.lintIssue, defaultConfig)) return;

    if (lintingIsDisabled(linting, defaultConfig)) return;

    expect(found).toBeDefined();
  });
};

export const validatorMockFilePath = (fileName: string) =>
  path.join("src", "tests", "mocks", "validators", fileName);

export const exceptionMockFilePath = (fileName: string) =>
  path.join("src", "tests", "mocks", "exceptions", fileName);

const groupByLintArea = (list: Linting[]) =>
  list.reduce<{ [key: string]: Linting[] }>((acc, linting) => {
    linting.lintAreas.forEach((lintArea) => {
      const accLintArea = acc[lintArea] ?? [];
      accLintArea.push(linting);
      acc[lintArea] = accLintArea;
    });

    return acc;
  }, {});

export const lintingsByGroup = groupByLintArea(Object.values(LINTINGS));

/**
 * Separate one linting from others based on a test.
 *
 * Only _one_ linting is expected to pass.
 */
const partition =
  (test: (linting: Linting) => boolean) =>
  (array: Linting[]): [Linting, Linting[]] => {
    const pass: Linting[] = [];
    const fail: Linting[] = [];
    array.forEach((item) => (test(item) ? pass : fail).push(item));

    return [pass[0], fail];
  };

export const separateContinueOnFail = partition(
  (linting: Linting) =>
    linting.message === masterConfig.lintings.MISSING_CONTINUE_ON_FAIL.message
);
