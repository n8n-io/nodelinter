import chalk from "chalk";
import fs from "fs";
import ts from "typescript";
import path from "path";
import { Traverser, Validator, Presenter } from "../services";
import { Prompter } from "../services/Prompter";
import { isLintable, printJson, showError } from "../utils";
import { ERRORS } from "../constants";

export async function lintOne(
  config: Config,
  { print = false }: { print: boolean | undefined }
) {
  if (!isLintable(config.target)) {
    showError(ERRORS.NOT_LINTABLE_TARGET);
    process.exit(1);
  }

  let userPrintName = "";
  if (print) {
    userPrintName = await new Prompter().askForPrintName();
  }

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
    printJson(userPrintName, validator.logs);
    console.log(
      chalk.bold(
        `Logs printed to ${path.join(process.cwd(), `${userPrintName}.json`)}`
      )
    );
  }
}
