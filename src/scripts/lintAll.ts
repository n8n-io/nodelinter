import fs from "fs";
import ts from "typescript";
import path from "path";
import { Validator, Traverser, Presenter } from "../services";

import { printJson } from "../utils";
import { config } from "../config";

const executionStart = new Date().getTime();

const collect = (
  dir: string,
  check: (arg: string) => boolean,
  collection: string[] = []
): string[] => {
  fs.readdirSync(dir).forEach((i) => {
    const iPath = path.join(dir, i);

    if (fs.lstatSync(iPath).isDirectory()) {
      collect(iPath, check, collection);
    }

    if (check(i)) collection.push(iPath);
  });

  return collection;
};

const isTargetFile = (fileName: string) =>
  fileName.endsWith("Description.ts") || fileName.endsWith(".node.ts");

const paths = collect(config.targetDir, isTargetFile);

const allFilesLogs: Log[] = [];

paths.forEach((path) => {
  const source = fs.readFileSync(path, "utf8");

  const validator = new Validator(path);

  try {
    ts.transpileModule(source.toString(), {
      transformers: { before: [Traverser.traverse(validator)] },
    });
  } catch (transpilationError) {
    console.log("******");
    console.log(path);
    console.log(transpilationError);
    console.log("******");
  }

  if (validator.logs.length) allFilesLogs.push(...validator.logs);

  Presenter.showLogs(validator.logs, { targetHasFullPath: true });
});

const executionTimeMs = new Date().getTime() - executionStart;

Presenter.summarize(allFilesLogs, executionTimeMs);

// printJson("lintAll", lintAll);
