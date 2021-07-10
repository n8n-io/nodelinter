import chalk from "chalk";
import fs from "fs";
import ts from "typescript";
import path from "path";
import { Traverser, Validator, Presenter } from "../services";
import { Prompter } from "../services/Prompter";
import { printJson } from "../utils";

export function lintOne(config: Config, { print = false }: { print: boolean }) {
  const executionStart = new Date().getTime();
  Traverser.sourceFilePath = config.target;
  const validator = new Validator();
  const sourceFileContents = fs.readFileSync(config.target, "utf8");

  ts.transpileModule(sourceFileContents, {
    transformers: { before: [Traverser.traverse(validator)] },
  });

  const executionTimeMs = new Date().getTime() - executionStart;

  const presenter = new Presenter(config);
  presenter.showLogs(validator.logs);
  presenter.summarize(validator.logs, executionTimeMs);

  if (print) {
    new Prompter().askForPrintName().then((printName) => {
      printJson(printName, validator.logs);
      console.log(
        chalk.bold(
          `Logs printed to ${path.join(process.cwd(), `${printName}.json`)}`
        )
      );
    });
  }
}
