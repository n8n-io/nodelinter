import chalk from "chalk";
import fs from "fs";
import ts from "typescript";
import path from "path";
import { Presenter, Traverser, Validator } from "../services";
import { isLintable, terminate } from "../utils";
import { ERRORS } from "../constants";

export async function lintOne(
  config: Config,
  { printLogs }: { printLogs: boolean }
) {
  if (!isLintable(config.target)) {
    terminate(ERRORS.NOT_LINTABLE_TARGET);
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

  if (printLogs) {
    Presenter.printJson("lintOutput", validator.logs);
    console.log("Logs printed to:");
    console.log(chalk.bold(`${path.join(process.cwd(), "lintOutput.json")}`));
  }
}
