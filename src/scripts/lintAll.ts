import ts from "typescript";
import fs from "fs";
import path from "path";
import { Presenter, Traverser, Validator } from "../services";
import { collect } from "../utils";
import chalk from "chalk";

export async function lintAll(
  config: Config,
  { printLogs }: { printLogs: boolean }
) {
  const isFileToLint = (fileName: string) =>
    config.patterns.some((pattern) => fileName.endsWith(pattern));

  const sourceFilePaths = collect(config.target, isFileToLint);

  if (config.extractDescriptions) {
    extract(sourceFilePaths);
    process.exit(0);
  }

  const executionStart = new Date().getTime();

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

  if (printLogs) {
    Presenter.printJson("lintOutput", allFilesLogs);
    console.log("Logs printed to:");
    console.log(chalk.bold(`${path.join(process.cwd(), "lintOutput.json")}`));
  }
}

const extract = (sourceFilePaths: string[]) => {
  sourceFilePaths.forEach((sourceFilePath) => {
    Traverser.sourceFilePath = sourceFilePath;

    const sourceFileContents = fs.readFileSync(sourceFilePath, "utf8");

    ts.transpileModule(sourceFileContents.toString(), {
      transformers: { before: [Traverser.extract()] },
    });
  });

  Presenter.printJson("extractedDescriptions", Traverser.extractedDescriptions);
};
