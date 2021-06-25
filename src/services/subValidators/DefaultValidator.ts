import ts from "typescript";
import { isBooleanKeyword } from "../../utils";
import { LINTINGS } from "../../lintings";

export class DefaultValidator implements SubValidator {
  static lintArea = "default" as const;

  logs: Log[];
  log: LogFunction;

  /**
   * Validate if every param has a default and if the value for the default conforms to the param type.
   */
  public run = (node: ts.Node) => {
    [
      this.validateDefaultExists,
      this.validateStringDefault,
      this.validateNumberDefault,
      this.validateBooleanDefault,
      this.validateCollectionDefault,
      this.validateMultiOptionsDefault,
      this.validateOptionsDefault,
    ].forEach((f) => f(node));

    return this.logs;
  };

  /**
   * Validate if a param has a default.
   */
  private validateDefaultExists = (node: ts.Node) => {
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
  };

  /**
   * Generate a function that validates if the value for a `default` conforms to the param type.
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

  /**
   * Validate if a param with `type: string` has a string default.
   */
  private validateStringDefault = this.defaultValidatorGenerator(
    "string",
    ts.isStringLiteral,
    LINTINGS.WRONG_DEFAULT_FOR_STRING_TYPE_PARAM
  );

  /**
   * Validate if a param with `type: number` has a numeric default.
   */
  private validateNumberDefault = this.defaultValidatorGenerator(
    "number",
    ts.isNumericLiteral,
    LINTINGS.WRONG_DEFAULT_FOR_NUMBER_TYPE_PARAM
  );

  /**
   * Validate if a param with `type: boolean` has a boolean default.
   */
  private validateBooleanDefault = this.defaultValidatorGenerator(
    "boolean",
    isBooleanKeyword,
    LINTINGS.WRONG_DEFAULT_FOR_BOOLEAN_TYPE_PARAM
  );

  /**
   * Validate if a param with `type: collection` has an object literal expression default.
   */
  private validateCollectionDefault = this.defaultValidatorGenerator(
    "collection",
    ts.isObjectLiteralExpression,
    LINTINGS.WRONG_DEFAULT_FOR_COLLECTION_TYPE_PARAM
  );

  /**
   * Validate if a param with `type: multiOptions` has an array literal expression default.
   */
  private validateMultiOptionsDefault = this.defaultValidatorGenerator(
    "multiOptions",
    ts.isArrayLiteralExpression,
    LINTINGS.WRONG_DEFAULT_FOR_MULTIOPTIONS_TYPE_PARAM
  );

  /**
   * Validate if a param with `type: options` has an option value as default.
   */
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

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() !== "options") return;
        if (!ts.isArrayLiteralExpression(node.getChildAt(2))) return;

        node.getChildAt(2).forEachChild((node) => {
          if (!ts.isObjectLiteralExpression(node)) return;
          node.forEachChild((node) => {
            if (
              ts.isPropertyAssignment(node) &&
              node.getChildAt(0).getText() === "value"
            ) {
              optionValues.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
              );
            }
          });
        });
      });

      if (!optionValues.includes(defaultOptionValue)) {
        this.log(LINTINGS.WRONG_DEFAULT_FOR_OPTIONS_TYPE_PARAM)(
          defaultNodeToReport
        );
      }
    }
  };
}
