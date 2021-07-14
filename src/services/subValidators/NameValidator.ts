import ts from "typescript";
import { isCamelCase } from "../../utils";
import { LINTINGS } from "../../lintings";

export class NameValidator implements SubValidator {
  static lintArea = "name" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "name"
    ) {
      const hasDefaultsParent = node?.parent?.parent
        ?.getText()
        .startsWith("defaults"); // skip check for defaults

      if (hasDefaultsParent) return;

      const nameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (nameValue === "authentication") {
        this.log(LINTINGS.AUTHENTICATION_PROPERTY_NOT_IN_CREDENTIALS)(node);
      }

      let isOption = false;
      node.parent.forEachChild((node) => {
        if (
          ts.isPropertyAssignment(node) &&
          node.getChildAt(0).getText() === "value"
        ) {
          isOption = true;
        }
      });

      if (!isOption) {
        if (
          (nameValue.length > 2 &&
            !nameValue.includes("_") &&
            nameValue.includes("id")) ||
          nameValue.includes("ID")
        ) {
          this.log(LINTINGS.NAME_WITH_MISCASED_ID)(node);
        }

        if (!isCamelCase(nameValue)) {
          this.log(LINTINGS.NAME_WITH_NO_CAMELCASE)(node);
        }
      }
    }

    return this.logs;
  }
}
