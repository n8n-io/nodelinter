import ts from "typescript";
import { isBooleanKeyword } from "../../utils";
import { LINTINGS } from "../../lintings";

export class DefaultValidator implements SubValidator {
  static lintArea = "default" as const;

  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    this.validateDefaultExists(node);

    this.validateStringDefault(node);
    this.validateNumberDefault(node);
    this.validateBooleanDefault(node);
    this.validateCollectionDefault(node);
    this.validateMultiOptionsDefault(node);
    this.validateOptionsDefault(node);

    this.validateSimplifyDefault(node);

    return this.logs;
  }

  private validateDefaultExists(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type"
    ) {
      let hasDefault = false;
      node.parent.forEachChild((node) => {
        if (
          ts.isPropertyAssignment(node) &&
          node.getChildAt(0).getText() === "default"
        ) {
          hasDefault = true;
        }
      });

      if (!hasDefault) {
        this.log(LINTINGS.DEFAULT_MISSING)(node);
      }
    }
  }

  private validateSimplifyDefault(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "displayName" &&
      node.getChildAt(2).getText() === "'Simplify Response'"
    ) {
      node.parent.forEachChild((node) => {
        if (
          ts.isPropertyAssignment(node) &&
          node.getChildAt(0).getText() === "default" &&
          node.getChildAt(2).getText() === "false"
        ) {
          this.log(LINTINGS.WRONG_DEFAULT_FOR_SIMPLIFY_PARAM)(node);
        }
      });
    }
  }

  /**
   * Generate a function that validates if the value for a `default` conforms to the param `type`.
   *
   * Not applicable for default values must conform to `displayName`, e.g. `default: true` for
   * `displayName: 'Simplify Response'`.
   */
  private defaultValidatorGenerator =
    (
      typeName: ParameterType,
      typeCheck: (node: ts.Node) => boolean,
      linting: Linting
    ) =>
    (node: ts.Node) => {
      if (
        ts.isPropertyAssignment(node) &&
        node.getChildAt(0).getText() === "type" &&
        node.getChildAt(2).getText() === `'${typeName}'`
      ) {
        node.parent.forEachChild((node) => {
          if (
            node.getChildAt(0).getText() === "default" &&
            !typeCheck(node.getChildAt(2))
          )
            this.log(linting)(node);
        });
      }
    };

  private validateStringDefault = this.defaultValidatorGenerator(
    "string",
    ts.isStringLiteral,
    LINTINGS.WRONG_DEFAULT_FOR_STRING_TYPE_PARAM
  );

  private validateNumberDefault = this.defaultValidatorGenerator(
    "number",
    ts.isNumericLiteral,
    LINTINGS.WRONG_DEFAULT_FOR_NUMBER_TYPE_PARAM
  );

  private validateBooleanDefault = this.defaultValidatorGenerator(
    "boolean",
    isBooleanKeyword,
    LINTINGS.WRONG_DEFAULT_FOR_BOOLEAN_TYPE_PARAM
  );

  private validateCollectionDefault = this.defaultValidatorGenerator(
    "collection",
    ts.isObjectLiteralExpression,
    LINTINGS.WRONG_DEFAULT_FOR_COLLECTION_TYPE_PARAM
  );

  private validateMultiOptionsDefault = this.defaultValidatorGenerator(
    "multiOptions",
    ts.isArrayLiteralExpression,
    LINTINGS.WRONG_DEFAULT_FOR_MULTIOPTIONS_TYPE_PARAM
  );

  private validateOptionsDefault = (node: ts.Node) => {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type" &&
      node.getChildAt(2).getText() === "'options'"
    ) {
      let hasTypeOptionsSibling = false;

      node?.parent?.forEachChild((child) => {
        if (child.getChildAt(0).getText() === "typeOptions") {
          hasTypeOptionsSibling = true;
        }
      });

      if (hasTypeOptionsSibling) return;

      let defaultNodeToReport: ts.Node = node; // if the includes check fails
      let defaultOptionValue = "";
      let optionValues: string[] = [];

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() === "default") {
          defaultOptionValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes
          defaultNodeToReport = node;
        }
      });

      let hasOptionsInVariable = false;

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() !== "options") return;

        // value of options is variable instead of array literal
        if (ts.isIdentifier(node.getChildAt(2))) {
          hasOptionsInVariable = true;
        }

        if (!ts.isArrayLiteralExpression(node.getChildAt(2))) return;

        node.getChildAt(2).forEachChild((node) => {
          if (!ts.isObjectLiteralExpression(node)) return;
          node.forEachChild((node) => {
            if (
              ts.isPropertyAssignment(node) &&
              node.getChildAt(0).getText() === "value"
            ) {
              optionValues.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes
              );
            }
          });
        });
      });

      if (!optionValues.includes(defaultOptionValue) && !hasOptionsInVariable) {
        this.log(LINTINGS.WRONG_DEFAULT_FOR_OPTIONS_TYPE_PARAM)(
          defaultNodeToReport
        );
      }
    }
  };
}
