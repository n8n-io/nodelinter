import ts from "typescript";
import fs from "fs";
import { config } from "./config";

export const isBooleanKeyword = (node: ts.Node) =>
  node.kind === ts.SyntaxKind.TrueKeyword ||
  node.kind === ts.SyntaxKind.FalseKeyword;

export const areAlphabetized = (optionValues: string[]) =>
  optionValues.join() === optionValues.sort().join();

export const startsWithCapital = (str: string) =>
  str[0] === str[0].toUpperCase();

export const isTitleCase = (str: string) => /^([A-Z]\w*\s*)*$/.test(str);

export const isCamelCase = (str: string) => /^([a-z]+[A-Z0-9]*)*$/.test(str);

export const hasAnchorLink = (str: string) => /<a href=/.test(str);

export const hasTargetBlank = (str: string) => /target="_blank"/.test(str);

export const printJson = (fileName: string, logs: Log[]) =>
  fs.writeFileSync(`${fileName}.json`, JSON.stringify(logs, null, 2));

export const lintAreaIsDisabled = (lintArea: LintArea) =>
  !config.lintAreasEnabled[lintArea];

export const lintIssueIsDisabled = (lintIssue: LintIssue) =>
  !config.lintIssuesEnabled[lintIssue];
