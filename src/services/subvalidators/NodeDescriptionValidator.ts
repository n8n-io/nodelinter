import ts from "typescript";
import { LINTINGS } from "../../lintings";
import { STANDARD_DESCRIPTIONS } from "../../constants";
import { Navigator } from "../Navigator";
import { Collector } from "../Collector";

export class NodeDescriptionValidator implements SubValidator {
  static lintArea = "nodeDescription" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      (node.getChildAt(0).getText() === "displayName" ||
        node.getChildAt(0).getText() === "name")
    ) {
      // TODO: Clean this up
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

    if (Navigator.isAssignment(node, { key: "icon" })) {
      const iconValue = node.getChildAt(2).getText();

      if (iconValue.endsWith(".png'")) {
        this.log(LINTINGS.PNG_ICON_IN_NODE_DESCRIPTION)(node);
      }
    }

    if (Navigator.isAssignment(node, { key: "inputs" })) {
      const inputsContents = node.getChildAt(2).getChildAt(1).getText();

      const numberOfInputs =
        inputsContents === "" ? 0 : inputsContents.split(",").length;

      if (Collector.isRegularNode && numberOfInputs === 0) {
        this.log(LINTINGS.WRONG_NUMBER_OF_INPUTS_IN_REGULAR_NODE_DESCRIPTION)(
          node
        );
      } else if (Collector.isTriggerNode && numberOfInputs !== 0) {
        this.log(LINTINGS.WRONG_NUMBER_OF_INPUTS_IN_TRIGGER_NODE_DESCRIPTION)(
          node
        );
      }
    }

    if (Navigator.isAssignment(node, { key: "outputs" })) {
      const outputsContents = node.getChildAt(2).getChildAt(1).getText();

      const numberOfOutputs =
        outputsContents === "" ? 0 : outputsContents.split(",").length;

      if (Collector.isRegularNode && numberOfOutputs === 0) {
        this.log(LINTINGS.WRONG_NUMBER_OF_OUTPUTS_IN_NODE_DESCRIPTION)(node);
      }
    }

    if (Navigator.isAssignment(node, { key: "credentials" })) {
      const arrayLiteralExpression = node.getChildAt(2);

      arrayLiteralExpression.forEachChild(credentialsObject => {
        let isNonOAuth = false;
        let hasTestedBy = false;

        credentialsObject.forEachChild(propertyAssignment => {
          const key = propertyAssignment.getChildAt(0).getText();
          const value = propertyAssignment.getChildAt(2).getText().clean();

          if (key === "name" && value.endsWith("Api") && !value.endsWith("OAuth2Api")) {
            isNonOAuth = true;
          } else if (key === 'testedBy') {
            hasTestedBy = true;
          }
        });

        if (isNonOAuth && !hasTestedBy) {
          this.log(LINTINGS.MISSING_NONOAUTH_CREDENTIALS_TEST_METHOD_REFERENCE)(credentialsObject)
        }
      });
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
            `'${STANDARD_DESCRIPTIONS.subtitle}'`
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
