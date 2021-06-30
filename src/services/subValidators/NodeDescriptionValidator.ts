import ts from "typescript";
import { LINTINGS } from "../../lintings";

export class NodeDescriptionValidator implements SubValidator {
  static lintArea = "nodeDescription" as const;
  logs: Log[];
  log: LogFunction;

  static standardSubtitle = `'={{$parameter["operation"] + ": " + $parameter["resource"]}}'`;

  public run(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      (node.getChildAt(0).getText() === "displayName" ||
        node.getChildAt(0).getText() === "name")
    ) {
      node.parent.parent.parent.parent.forEachChild((child) => {
        if (
          ts.isClassDeclaration(child) &&
          child.getChildAt(2).getText().endsWith("Trigger") && // class name is "*Trigger"
          !node.getChildAt(2).getText().endsWith(" Trigger'") &&
          node.getChildAt(0).getText() === "displayName" // display name is not "* Trigger"
        ) {
          this.log(
            LINTINGS.DISPLAYNAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION
          )(node);
        }

        if (
          ts.isClassDeclaration(child) &&
          child.getChildAt(2).getText().endsWith("Trigger") && // class name is "*Trigger"
          !node.getChildAt(2).getText().endsWith("Trigger'") &&
          node.getChildAt(0).getText() === "name" // name is not "*Trigger"
        ) {
          this.log(LINTINGS.NAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION)(
            node
          );
        }
      });
    }

    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "icon"
    ) {
      const iconValue = node.getChildAt(2).getText();

      if (iconValue.endsWith(".png'")) {
        this.log(LINTINGS.PNG_ICON_IN_NODE_DESCRIPTION)(node);
      }
    }

    if (
      ts.isObjectLiteralExpression(node) &&
      ts.isPropertyDeclaration(node.parent) &&
      node.parent.getChildAt(0).getText() === "description"
    ) {
      let hasSubtitle = false;

      node.forEachChild((child) => {
        if (child.getChildAt(0).getText() === "subtitle") {
          hasSubtitle = true;

          if (
            child.getChildAt(2).getText() !==
            NodeDescriptionValidator.standardSubtitle
          ) {
            this.log(LINTINGS.NON_STANDARD_SUBTITLE)(child);
          }
        }
      });

      if (!hasSubtitle) {
        this.log(LINTINGS.SUBTITLE_MISSING_IN_NODE_DESCRIPTION)(node);
      }
    }

    return this.logs;
  }
}
