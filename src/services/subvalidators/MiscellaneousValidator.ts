import ts from "typescript";
import { LINTINGS } from "../../lintings";
import { STANDARD_DESCRIPTIONS } from "../../constants";
import { Navigator } from "../Navigator";
import { Collector } from "../Collector";

export class MiscellaneousValidator implements SubValidator {
  static lintArea = "miscellaneous" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (
      ts.isAsExpression(node) &&
      node.getChildAt(2).getText() === "INodeProperties[]"
    ) {
      this.log(LINTINGS.I_NODE_PROPERTIES_MISCASTING)(node);
    }

    if (Navigator.isAssignment(node, { key: "name", value: "resource" })) {
      let resourceHasNoDataExpression = false;

      node.parent.forEachChild((node) => {
        if (
          node.getChildAt(0).getText() === "noDataExpression" &&
          node.getChildAt(2).getText() === "true"
        ) {
          resourceHasNoDataExpression = true;
        }
      });

      if (!resourceHasNoDataExpression) {
        this.log(LINTINGS.RESOURCE_WITHOUT_NO_DATA_EXPRESSION)(node);
      }
    }

    if (Navigator.isAssignment(node, { key: "name", value: "operation" })) {
      let operationHasNoDataExpression = false;

      node.parent.forEachChild((node) => {
        if (
          node.getChildAt(0).getText() === "noDataExpression" &&
          node.getChildAt(2).getText() === "true"
        ) {
          operationHasNoDataExpression = true;
        }
      });

      if (!operationHasNoDataExpression) {
        this.log(LINTINGS.OPERATION_WITHOUT_NO_DATA_EXPRESSION)(node);
      }
    }

    if (Navigator.isAssignment(node, { key: "name", value: "returnAll" })) {
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
          if (Navigator.isAssignment(node, { key: "required", value: false })) {
            this.log(LINTINGS.REQUIRED_FALSE)(node);
          }
        })
      );
    }

    if (
      ts.isIdentifier(node) &&
      !ts.isTypeReferenceNode(node.parent) &&
      node.getText() === "Error"
    ) {
      this.log(LINTINGS.WRONG_ERROR_THROWN)(node.parent);
    }

    if (ts.isIdentifier(node) && node.getText() === "loadOptionsMethod") {
      const loadOptionsMethod = node.parent
        .getText()
        .split(":")
        .map((i) => i.trim().replace(/'/g, ""))
        .pop();

      if (
        loadOptionsMethod &&
        !Collector.loadOptionsMethods.includes(loadOptionsMethod)
      ) {
        this.log(LINTINGS.NON_EXISTENT_LOAD_OPTIONS_METHOD)(node.parent);
      }
    }

    return this.logs;
  }
}
