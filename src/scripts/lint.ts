import fs from "fs";
import ts from "typescript";
import { config } from "../config";
import { Traverser, Validator, Presenter } from "../services";

const executionStart = new Date().getTime();

const sourceFileContents = fs.readFileSync(config.sourceFilePath, "utf8");
Traverser.sourceFilePath = config.sourceFilePath;

const validator = new Validator(config.sourceFilePath);

ts.transpileModule(sourceFileContents, {
  transformers: { before: [Traverser.traverse(validator)] },
});

const executionTimeMs = new Date().getTime() - executionStart;

Presenter.showLogs(validator.logs);
Presenter.summarize(validator.logs, executionTimeMs);
