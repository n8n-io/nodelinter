import ts from "typescript";
import { STANDARD_NAMES } from "../../constants";
import { LINTINGS } from "../../lintings";
import { isTitleCase } from "../../utils";
import { Navigator } from "../Navigator";

export class DisplayNameValidator implements SubValidator {
  static lintArea = "displayName" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (Navigator.isAssignment(node, { key: "name", value: "simple" })) {
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

    if (Navigator.isAssignment(node, { key: "type", value: "collection" })) {
      node.parent.forEachChild((child) => {
        if (Navigator.isAssignment(child, { key: "displayOptions" })) {
          const operationNode = Navigator.findDescendant(child, {
            text: "operation",
          });

          if (!operationNode) return;

          const updateNode = Navigator.findDescendant(operationNode.parent, {
            text: "'update'",
          });

          if (!updateNode) return;

          node.parent.forEachChild((child) => {
            if (Navigator.isAssignment(child, { key: "displayName" })) {
              if (child.getChildAt(2).getText() !== "'Update Fields'") {
                this.log(LINTINGS.DISPLAYNAME_NOT_UPDATE_FIELDS)(child);
              }
            }
          });
        }
      });
    }

    if (Navigator.isAssignment(node, { key: "displayName" })) {
      const displayNameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (displayNameValue.match(/id$/) || displayNameValue.match(/Id$/)) {
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
