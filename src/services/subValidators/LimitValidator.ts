import ts from "typescript";
import { LINTINGS } from "../../lintings";

export class LimitValidator implements SubValidator {
  static lintArea = "limit" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "name"
    ) {
      const nameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (nameValue === "limit") {
        let hasTypeOptions = false;

        node.parent.forEachChild((node) => {
          if (
            ts.isPropertyAssignment(node) &&
            node.getChildAt(0).getText() === "default" &&
            node.getChildAt(2).getText() !== "50"
          ) {
            this.log(LINTINGS.WRONG_DEFAULT_FOR_LIMIT_PARAM)(node);
          }

          if (
            ts.isPropertyAssignment(node) &&
            node.getChildAt(0).getText() === "typeOptions"
          ) {
            node.getChildAt(2).forEachChild((node) => {
              if (node.getChildAt(0).getText() === "minValue") {
                hasTypeOptions = true;
                const minValue = node.getChildAt(2).getText();
                if (Number(minValue) < 1) {
                  this.log(LINTINGS.LIMIT_LOWER_THAN_ONE)(node);
                }
              }
            });
          }
        });

        if (!hasTypeOptions) {
          this.log(LINTINGS.LIMIT_WITHOUT_TYPE_OPTIONS)(node);
        }
      }
    }

    return this.logs;
  }
}
