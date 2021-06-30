import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { LINTINGS } from "../lintings";
import { Logger } from "../services";
import * as subValidators from "./subValidators";
import { MiscellaneousValidator } from "./subValidators";

export class Validator {
  public logs: Log[] = [];
  private node: ts.Node;
  public sourceFilePath = "";

  constructor(sourceFilePath: string) {
    this.sourceFilePath = sourceFilePath;
  }

  public setNode(node: ts.Node) {
    this.node = node;
    return this;
  }

  public run() {
    Object.values(subValidators).forEach((subValidator) => {
      this.runSubValidator(subValidator);
    });
  }

  private runSubValidator(constructor: SubValidatorConstructor) {
    const SubValidator = Logger(constructor);
    const logs = new SubValidator().run(this.node);

    if (logs?.length) this.logs.push(...logs);
  }

  /**
   * Run validation checks _after_ the source file AST has been fully traversed.
   */
  public runFinal(sourceFile: ts.SourceFile) {
    if (!MiscellaneousValidator.hasContinueOnFail) {
      const linting = LINTINGS.MISSING_CONTINUE_ON_FAIL;

      const { line } = getLine(sourceFile, sourceFile.getChildAt(0).getEnd());

      this.logs.push({
        message: linting.message,
        lintAreas: linting.lintAreas,
        lintIssue: linting.lintIssue,
        line: line + 1,
        excerpt: "<large excerpt omitted>",
        sourceFilePath: this.sourceFilePath,
        logLevel: linting.logLevel,
        ...(linting.details && { details: linting.details }),
      });
    }
  }
}
