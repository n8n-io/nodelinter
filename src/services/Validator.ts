import ts from "typescript";
import { masterConfig } from "..";
import { LINTINGS } from "../lintings";
import { Logger, Traverser } from "../services";
import { lintAreaIsDisabled, lintingIsDisabled, isRegularNode } from "../utils";
import { Collector } from "./Collector";
import { Selector } from "./Selector";
import * as subValidators from "./subValidators";

export class Validator {
  public logs: Log[] = [];
  private currentNode: ts.Node;

  /**
   * Path to test file in `src/tests/input/`.
   */
  public testSourceFilePath: string | undefined;

  constructor(testSourceFilePath?: string) {
    this.testSourceFilePath = testSourceFilePath;
  }

  public setNode(node: ts.Node) {
    this.currentNode = node;
    return this;
  }

  public run() {
    Collector.run(this.currentNode);

    Object.values(subValidators).forEach((subValidator) => {
      if (lintAreaIsDisabled(subValidator.lintArea, masterConfig)) return;
      this.runSubValidator(subValidator);
    });
  }

  private runSubValidator(constructor: SubValidatorConstructor) {
    const SubValidator = Logger(constructor);
    const logs = new SubValidator().run(this.currentNode);

    if (logs?.length) this.logs.push(...logs);
  }

  /**
   * Run validation checks _after_ the source file AST has been fully traversed.
   *
   * TODO: Refactor to remove duplication with `Logger.log()`
   */
  public runFinal(sourceFile: ts.SourceFile, sourceFilePath: string) {
    const nodeName = sourceFilePath.split("/").pop();
    const { sourceFileHasContinueOnFail } = Collector;

    if (isRegularNode(nodeName) && !sourceFileHasContinueOnFail) {
      const linting = LINTINGS.MISSING_CONTINUE_ON_FAIL;

      let line = Selector.lineNumber(sourceFile.getChildAt(0));

      line += 1; // TODO: Find out why this offset is needed

      if (lintingIsDisabled(linting, masterConfig)) return;

      this.logs.push({
        message: linting.message,
        lintAreas: linting.lintAreas,
        lintIssue: linting.lintIssue,
        line,
        excerpt: "<large excerpt omitted>",
        sourceFilePath: this.testSourceFilePath ?? Traverser.sourceFilePath,
        logLevel: linting.logLevel,
        ...(linting.details && { details: linting.details }),
      });
    }
  }
}
