import ts from "typescript";
import fs from "fs";
import path from "path";
import { Traverser, Validator, Presenter } from "../services";
import { collect, isLintableFile, printJson } from "../utils";
import { Prompter } from "../services/Prompter";
import chalk from "chalk";

export function lintAll(config: Config, { print = false }: { print: boolean }) {
  const executionStart = new Date().getTime();
  const sourceFilePaths = collect(config.target, isLintableFile);
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

  if (print) {
    new Prompter().askForPrintName().then((printName) => {
      printJson(printName, allFilesLogs);
      console.log(
        chalk.bold(
          `Logs printed to ${path.join(process.cwd(), `${printName}.json`)}`
        )
      );
    });
  }
}
