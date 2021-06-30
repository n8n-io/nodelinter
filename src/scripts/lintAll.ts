import fs from "fs";
import ts from "typescript";
import path from "path";
import { Validator, Traverser, Presenter } from "../services";

import { printJson } from "../utils";
import { config } from "../config";

// ----------------------------------
//             utils
// ----------------------------------

/**
 * Traverse a dir recursively and collect a file paths that pass a test.
 */
const collect = (
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

const isTargetFile = (fileName: string) =>
  fileName.endsWith("Description.ts") || fileName.endsWith(".node.ts");

// ----------------------------------
//             script
// ----------------------------------

const executionStart = new Date().getTime();

const sourceFilePaths = collect(config.sourceDirPath, isTargetFile);

const allFilesLogs: Log[] = [];

sourceFilePaths.forEach((sourceFilePath) => {
  Traverser.sourceFilePath = sourceFilePath;
  const validator = new Validator();

  const sourceFileContents = fs.readFileSync(sourceFilePath, "utf8");

  ts.transpileModule(sourceFileContents.toString(), {
    transformers: { before: [Traverser.traverse(validator)] },
  });

  if (validator.logs.length) allFilesLogs.push(...validator.logs);

  Presenter.showLogs(validator.logs, { targetHasFullPath: true });
});

const executionTimeMs = new Date().getTime() - executionStart;

Presenter.summarize(allFilesLogs, executionTimeMs);

// printJson("lintAll", lintAll);
