import ts from "typescript";
import { LINTINGS } from "../../lintings";
import { isTitleCase } from "../../utils";

export class DisplayNameValidator implements SubValidator {
  static lintArea = "displayName" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
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
    }

    return this.logs;
  }
}
