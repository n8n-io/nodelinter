import ts from "typescript";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { titleCase } from "title-case";

export const isBooleanKeyword = (node: ts.Node) =>
  node.kind === ts.SyntaxKind.TrueKeyword ||
  node.kind === ts.SyntaxKind.FalseKeyword;

export const areAlphabetized = (items: string[]) =>
  items.join() === items.sort().join();

export const startsWithCapital = (str: string) =>
  str[0] === str[0].toUpperCase();

export const isTitleCase = (str: string) => str === titleCase(str);

export const isCamelCase = (str: string) =>
  /^([a-z]+[A-Z0-9]*)*$/.test(str) || /^[0-9]*$/.test(str);

export const hasAnchorLink = (str: string) => /<a href=/.test(str);

export const hasTargetBlank = (str: string) => /target="_blank"/.test(str);

export const printJson = (fileName: string, content: object) =>
  fs.writeFileSync(`${fileName}.json`, JSON.stringify(content, null, 2));

export const lintAreaIsDisabled = (lintArea: LintArea, config: Config) =>
  !config.enable.lintAreas[lintArea];

export const lintIssueIsDisabled = (lintIssue: LintIssue, config: Config) =>
  !config.enable.lintIssues[lintIssue];

export const logLevelIsDisabled = (logLevel: LogLevel, config: Config) =>
  !config.enable.logLevels[logLevel];

// TODO: Inefficient retrieval of linting's enabled state in masterConfig
export const lintingIsDisabled = (linting: Linting, config: Config) => {
  const configLinting = Object.values(config.lintings).find((configLinting) => {
    return configLinting.message === linting.message;
  });

  if (!configLinting) {
    throw new Error(`No config linting found for: ${linting.message}`);
  }

  return !configLinting.enabled;
};

// TODO: Type properly
export const deepMerge = (...objects: any) => {
  let result: any = {};

  for (const o of objects) {
    for (let [key, value] of Object.entries(o)) {
      if (value instanceof Object && key in result) {
        value = deepMerge(result[key], value);
      }

      result = { ...result, [key]: value };
    }
  }

  return result;
};

/**
 * Traverse a dir recursively and collect file paths that pass a test.
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

export const isLintableFile = (fileName: string) =>
  fileName.endsWith("Description.ts") || fileName.endsWith(".node.ts");

export const showError = (errorMessage: string) =>
  console.log(
    [
      chalk.red.inverse("error".padStart(7, " ").padEnd(9, " ").toUpperCase()),
      chalk.bold(errorMessage),
      "\n",
    ].join(" ")
  );
