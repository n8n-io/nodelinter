import ts from "typescript";
import { STANDARD_DESCRIPTIONS } from "../../constants";
import { LINTINGS } from "../../lintings";
import { Navigator } from "../Navigator";

export class LimitValidator implements SubValidator {
  static lintArea = "limit" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (Navigator.isAssignment(node, { key: "name" })) {
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
            node.getChildAt(0).getText() === "description" &&
            node.getChildAt(2).getText() !== `'${STANDARD_DESCRIPTIONS.limit}'`
          ) {
            this.log(LINTINGS.NON_STANDARD_LIMIT_DESCRIPTION)(node);
          }

          if (Navigator.isAssignment(node, { key: "typeOptions" })) {
            node.getChildAt(2).forEachChild((node) => {
              if (node.getChildAt(0).getText() === "minValue") {
                hasTypeOptions = true;
                const minValue = node.getChildAt(2).getText();
                if (Number(minValue) < 1) {
                  this.log(LINTINGS.LIMIT_WITH_MIN_VALUE_LOWER_THAN_ONE)(node);
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
