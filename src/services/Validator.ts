import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { masterConfig } from "..";
import { LINTINGS } from "../lintings";
import { Logger, Traverser } from "../services";
import { lintingIsDisabled } from "../utils";
import * as subValidators from "./subValidators";
import { MiscellaneousValidator } from "./subValidators";

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
    Object.values(subValidators).forEach((subValidator) => {
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
    const isNodeFile = sourceFilePath.split("/").pop()?.endsWith(".node.ts");

    if (isNodeFile && !MiscellaneousValidator.hasContinueOnFail) {
      const linting = LINTINGS.MISSING_CONTINUE_ON_FAIL;

      const { line } = getLine(sourceFile, sourceFile.getChildAt(0).getEnd());

      if (lintingIsDisabled(linting, masterConfig)) return;

      this.logs.push({
        message: linting.message,
        lintAreas: linting.lintAreas,
        lintIssue: linting.lintIssue,
        line: line + 1,
        excerpt: "<large excerpt omitted>",
        sourceFilePath: this.testSourceFilePath ?? Traverser.sourceFilePath,
        logLevel: linting.logLevel,
        ...(linting.details && { details: linting.details }),
      });
    }
  }
}
