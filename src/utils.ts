import ts from "typescript";
import fs from "fs";
import { config } from "./config";
import path from "path";

export const isBooleanKeyword = (node: ts.Node) =>
  node.kind === ts.SyntaxKind.TrueKeyword ||
  node.kind === ts.SyntaxKind.FalseKeyword;

export const areAlphabetized = (items: string[]) =>
  items.join() === items.sort().join();

export const startsWithCapital = (str: string) =>
  str[0] === str[0].toUpperCase();

export const isTitleCase = (str: string) =>
  /^([A-Z]\w*\s*)*$/.test(str) || /^[0-9]*$/.test(str);

export const isCamelCase = (str: string) =>
  /^([a-z]+[A-Z0-9]*)*$/.test(str) || /^[0-9]*$/.test(str);

export const hasAnchorLink = (str: string) => /<a href=/.test(str);

export const hasTargetBlank = (str: string) => /target="_blank"/.test(str);

export const printJson = (fileName: string, logs: Log[]) =>
  fs.writeFileSync(`${fileName}.json`, JSON.stringify(logs, null, 2));

export const lintAreaIsDisabled = (lintArea: LintArea) =>
  !config.toggleLintAreas[lintArea];

export const lintIssueIsDisabled = (lintIssue: LintIssue) =>
  !config.toggleLintIssues[lintIssue];

export const logLevelIsDisabled = (logLevel: LogLevel) =>
  !config.toggleLogLevels[logLevel];

/**
 * Traverse a dir recursively and collect a file paths that pass a test.
 */
export const collect = (
  dir: string,
  test: (arg: string) => boolean,
  collection: string[] = []
): string[] => {
  fs.readdirSync(dir).forEach((i) => {
    const iPath = path.join(dir, i);

    if (fs.lstatSync(iPath).isDirectory()) {
      collect(iPath, test, collection);
    }

    if (test(i)) collection.push(iPath);
  });

  return collection;
};

export const isTargetFile = (fileName: string) =>
  fileName.endsWith("Description.ts") || fileName.endsWith(".node.ts");
