import ts from "typescript";
import fs from "fs";

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

export const lintAreaIsDisabled = (lintArea: LintArea, config: Config) =>
  !config.enable.lintAreas[lintArea];

export const lintIssueIsDisabled = (lintIssue: LintIssue, config: Config) =>
  !config.enable.lintIssues[lintIssue];

export const logLevelIsDisabled = (logLevel: LogLevel, config: Config) =>
  !config.enable.logLevels[logLevel];

// TODO: Inefficient retrieval of linting's enabled state in masterConfig
export const lintingIsEnabled = (linting: Linting, config: Config) => {
  const configLinting = Object.values(config.lintings).find((configLinting) => {
    return configLinting.message === linting.message;
  });

  if (!configLinting) {
    throw new Error(`No config linting found for: ${linting.message}`);
  }

  return configLinting.enabled;
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
