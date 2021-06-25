import fs from "fs";
import ts from "typescript";
import { Traverser, Validator, Summarizer, Presenter } from "../services";

const executionStart = new Date().getTime();

const SOURCE_FILE_PATH = "src/input/scratchpad9.ts";

const source = fs.readFileSync(SOURCE_FILE_PATH, "utf8");

const validator = new Validator(SOURCE_FILE_PATH);

ts.transpileModule(source, {
  transformers: { before: [Traverser.traverse(validator)] },
});

const executionTimeMs = new Date().getTime() - executionStart;

Presenter.showLogs(validator.logs);
Presenter.showSummary(Summarizer.run(validator.logs, executionTimeMs));
