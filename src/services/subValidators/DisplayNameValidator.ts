import ts from "typescript";
import { STANDARD_NAMES } from "../../constants";
import { LINTINGS } from "../../lintings";
import { isTitleCase } from "../../utils";

export class DisplayNameValidator implements SubValidator {
  static lintArea = "displayName" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (
      node?.getChildAt(0)?.getText() === "name" &&
      node?.getChildAt(2)?.getText() === "'simple'"
    ) {
      node.parent.forEachChild((node) => {
        if (
          node.getChildAt(0).getText() === "displayName" &&
          node.getChildAt(2).getText() !==
            `'${STANDARD_NAMES.simplifyResponse}'`
        ) {
          this.log(LINTINGS.NON_STANDARD_DISPLAY_NAME_FOR_SIMPLIFY_PARAM)(node);
        }
      });
    }

    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "displayName"
    ) {
      const displayNameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (displayNameValue.includes("id") || displayNameValue.includes("Id")) {
        this.log(LINTINGS.DISPLAYNAME_WITH_MISCASED_ID)(node);
      }

      if (!isTitleCase(displayNameValue)) {
        this.log(LINTINGS.DISPLAYNAME_WITH_NO_TITLECASE)(node);
      }

      if (
        node.getChildAt(2).getText().startsWith("' ") ||
        node.getChildAt(2).getText().endsWith(" '")
      ) {
        this.log(LINTINGS.DISPLAYNAME_UNTRIMMED)(node);
      }
    }

    return this.logs;
  }
}
