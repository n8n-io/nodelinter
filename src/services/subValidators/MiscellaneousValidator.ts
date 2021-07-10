import ts from "typescript";
import { Traverser } from "..";
import { LINTINGS } from "../../lintings";
import { STANDARD_DESCRIPTIONS } from "../../constants";

export class MiscellaneousValidator implements SubValidator {
  static lintArea = "miscellaneous" as const;
  logs: Log[];
  log: LogFunction;
  static hasContinueOnFail = false;

  public run(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "name" &&
      node.getChildAt(2).getText() === "'returnAll'"
    ) {
      node.parent.forEachChild((node) => {
        if (
          node.getChildAt(0).getText() === "description" &&
          node.getChildAt(2).getText() !==
            `'${STANDARD_DESCRIPTIONS.returnAll}'`
        )
          this.log(LINTINGS.NON_STANDARD_RETURNALL_DESCRIPTION)(node);
      });
    }

    if (
      ts.isPropertyAccessExpression(node) &&
      node.getChildAt(2).getText() === "apply" &&
      node.getChildAt(0).getText().includes(".") &&
      node.getChildAt(0).getText().split(".")[1] === "push"
    ) {
      this.log(LINTINGS.PUSH_APPLY)(node);
    }

    if (
      ts.isAsExpression(node) &&
      ts.isArrayLiteralExpression(node.getChildAt(0))
    ) {
      node.getChildAt(0).forEachChild((node) =>
        node.forEachChild((node) => {
          if (
            ts.isPropertyAssignment(node) &&
            node.getChildAt(0).getText() === "required" &&
            node.getChildAt(2).getText() === "false"
          ) {
            this.log(LINTINGS.REQUIRED_FALSE)(node);
          }
        })
      );
    }

    if (ts.isIdentifier(node) && node.getText() === "Error") {
      this.log(LINTINGS.WRONG_ERROR_THROWN)(node.parent);
    }

    if (
      Traverser.sourceFilePath.endsWith(".node.ts") &&
      ts.isPropertyAccessExpression(node) &&
      node.getChildAt(2).getText() === "continueOnFail"
    ) {
      MiscellaneousValidator.hasContinueOnFail = true;
    }

    return this.logs;
  }
}
