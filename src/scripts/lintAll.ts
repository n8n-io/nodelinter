import ts from "typescript";
import fs from "fs";
import path from "path";
import { Traverser, Validator, Presenter } from "../services";

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

export function lintAll(config: Config) {
  const executionStart = new Date().getTime();
  const sourceFilePaths = collect(config.target, isTargetFile);
  const allFilesLogs: Log[] = [];
  const presenter = new Presenter(config);

  sourceFilePaths.forEach((sourceFilePath) => {
    Traverser.sourceFilePath = sourceFilePath;
    const validator = new Validator();

    const sourceFileContents = fs.readFileSync(sourceFilePath, "utf8");

    ts.transpileModule(sourceFileContents.toString(), {
      transformers: { before: [Traverser.traverse(validator)] },
    });

    if (validator.logs.length) allFilesLogs.push(...validator.logs);

    presenter.showLogs(validator.logs);
  });

  const executionTimeMs = new Date().getTime() - executionStart;
  presenter.summarize(allFilesLogs, executionTimeMs);
}
