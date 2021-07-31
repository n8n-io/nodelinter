import ts from "typescript";
import fs from "fs";
import path from "path";
import { Traverser, Validator, Presenter } from "../services";
import { collect, printJson } from "../utils";
import chalk from "chalk";

export async function lintAll(
  config: Config,
  {
    shouldPrint,
    printFileName,
  }: { shouldPrint: boolean; printFileName: string }
) {
  const isFileToLint = (fileName: string) =>
    config.patterns.some((pattern) => fileName.endsWith(pattern));

  const executionStart = new Date().getTime();
  const sourceFilePaths = collect(config.target, isFileToLint);
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

  if (shouldPrint) {
    printJson(printFileName, allFilesLogs);
    console.log(
      chalk.bold(
        `Logs printed to ${path.join(process.cwd(), `${printFileName}.json`)}`
      )
    );
  }
}
