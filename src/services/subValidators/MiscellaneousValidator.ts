import ts from "typescript";
import { LINTINGS } from "../../lintings";
import { STANDARD_DESCRIPTIONS } from "../../constants";
import { Selector as $ } from "../Selector";
import { Collector } from "../Collector";

export class MiscellaneousValidator implements SubValidator {
  static lintArea = "miscellaneous" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if ($.isAssignment(node, { key: "name", value: "returnAll" })) {
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
          if ($.isAssignment(node, { key: "required", value: false })) {
            this.log(LINTINGS.REQUIRED_FALSE)(node);
          }
        })
      );
    }

    if (ts.isIdentifier(node) && node.getText() === "Error") {
      this.log(LINTINGS.WRONG_ERROR_THROWN)(node.parent);
    }

    if (ts.isIdentifier(node) && node.getText() === "loadOptionsMethod") {
      const loadOptionsMethod = node.parent
        .getChildAt(2)
        .getText()
        .replace(/'/g, "");

      if (!Collector.loadOptionsMethods.includes(loadOptionsMethod)) {
        this.log(LINTINGS.NON_EXISTENT_LOAD_OPTIONS_METHOD)(node.parent);
      }
    }

    return this.logs;
  }
}
