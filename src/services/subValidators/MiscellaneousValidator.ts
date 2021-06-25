import ts from "typescript";
import { LINTINGS } from "../../lintings";

export class MiscellaneousValidator implements SubValidator {
  static lintArea = "miscellaneous" as const;
  logs: Log[];
  log: LogFunction;

  public run = (node: ts.Node) => {
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

    return this.logs;
  };
}
