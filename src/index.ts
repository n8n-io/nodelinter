#!/usr/bin/env node

import fs from "fs";
import minimist from "minimist";
import ts from "typescript";
import { config } from "./config";
import { Traverser, Validator, Presenter } from "./services";
import { collect, isTargetFile } from "./utils";

const { path } = minimist(process.argv.slice(2), {
  string: "path",
});

if (!path) {
  throw new Error("No path passed in");
}

fs.lstatSync(path).isDirectory() ? lintAllFilesInDir() : lintSingleFile();

function lintAllFilesInDir() {
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
}

function lintSingleFile() {
  const executionStart = new Date().getTime();
  Traverser.sourceFilePath = config.sourceFilePath;
  const validator = new Validator();
  const sourceFileContents = fs.readFileSync(config.sourceFilePath, "utf8");

  ts.transpileModule(sourceFileContents, {
    transformers: { before: [Traverser.traverse(validator)] },
  });

  const executionTimeMs = new Date().getTime() - executionStart;

  Presenter.showLogs(validator.logs);
  Presenter.summarize(validator.logs, executionTimeMs);
}
