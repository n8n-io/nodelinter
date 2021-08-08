import ts from "typescript";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { titleCase } from "title-case";
import { LINTABLE_FILE_PATTERNS, LONG_LISTING_LIMIT } from "./constants";

// casing

export const areAlphabetized = (items: string[]) =>
  items.join() === items.sort().join();

export const areLongListing = (items: string[]) =>
  items.length >= LONG_LISTING_LIMIT;

export const startsWithCapital = (str: string) =>
  str[0] === str[0].toUpperCase();

export const isTitleCase = (str: string) => str === titleCase(str);

export const isCamelCase = (str: string) =>
  /^([a-z]+[A-Z0-9]*)*$/.test(str) || /^[0-9]*$/.test(str);

// selector helpers

export const hasAnchorLink = (str: string) => /<a href=/.test(str);

export const hasTargetBlank = (str: string) => /target="_blank"/.test(str);

// true utils

export const printJson = (fileName: string, content: object) =>
  fs.writeFileSync(`${fileName}.json`, JSON.stringify(content, null, 2));

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

// TODO: stderr instead of stdout
export function terminate(errorMessage: string): never {
  console.log(
    [
      chalk.red.inverse("error".padStart(7, " ").padEnd(9, " ").toUpperCase()),
      chalk.bold(errorMessage),
      "\n",
    ].join(" ")
  );

  process.exit(1);
}

export const isLintable = (target: string) =>
  LINTABLE_FILE_PATTERNS.some((pattern) => target.endsWith(pattern));

// disabled state

// TODO: Refactor
export const getLintingName = (targetLinting: Linting, config: Config) => {
  return Object.entries(config.lintings).find(
    (configLinting) => targetLinting.message === configLinting[1].message
  )![0];
};

// TODO: Inefficient retrieval of linting name from linting message
export const getLinting = (
  targetLinting: Linting | Log,
  configLintings: Config["lintings"]
) => {
  return Object.values(configLintings).find((configLinting) => {
    return configLinting.message === targetLinting.message;
  });
};

export const isRegularNode = (nodeName: string | undefined) =>
  nodeName?.endsWith(".node.ts") && !nodeName?.endsWith("Trigger.node.ts");
