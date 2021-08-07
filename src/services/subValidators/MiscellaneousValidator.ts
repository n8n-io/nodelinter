import ts from "typescript";
import { LINTINGS } from "../../lintings";
import { STANDARD_DESCRIPTIONS } from "../../constants";
import { isAnyKeyword } from "../../utils";

export class MiscellaneousValidator implements SubValidator {
  static lintArea = "miscellaneous" as const;
  logs: Log[];
  log: LogFunction;

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

    return this.logs;
  }
}
