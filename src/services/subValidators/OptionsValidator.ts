import ts from "typescript";
import { areAlphabetized } from "../../utils";
import { LINTINGS } from "../../lintings";

export class OptionsValidator implements SubValidator {
  static lintArea = "options" as const;
  logs: Log[];
  log: LogFunction;

  /**
   * Validate if every param has a default and if the value for the default conforms to the param type.
   */
  public run(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type" &&
      node.getChildAt(2).getText() === "'options'"
    ) {
      let optionsNodeToReport: ts.Node = node;
      let optionsValues: string[] = [];

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() !== "options") return;
        if (!ts.isArrayLiteralExpression(node.getChildAt(2))) return;

        optionsNodeToReport = node;
        node.getChildAt(2).forEachChild((node) => {
          if (!ts.isObjectLiteralExpression(node)) return;

          node.forEachChild((node) => {
            if (
              ts.isPropertyAssignment(node) &&
              node.getChildAt(0).getText() === "value"
            ) {
              if (node.getChildAt(2).getText() === "'upsert'") {
                node.parent.forEachChild((child) => {
                  if (child.getChildAt(0).getText() === "name") {
                    if (child.getChildAt(2).getText() !== "Create or Update") {
                      this.log(LINTINGS.UPSERT_OPTION_WITH_WRONG_NAME)(child);
                    }
                  }

                  if (child.getChildAt(0).getText() === "description") {
                    if (
                      child.getChildAt(2).getText() !==
                      "Create a new record, or update the current one if it already exists (upsert)"
                    ) {
                      this.log(LINTINGS.UPSERT_OPTION_WITH_WRONG_DESCRIPTION)(
                        child
                      );
                    }
                  }
                });
              }

              optionsValues.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
              );
            }
          });
        });
      });

      if (!areAlphabetized(optionsValues)) {
        this.log(LINTINGS.NON_ALPHABETIZED_OPTIONS)(optionsNodeToReport);
      }
    }
    return this.logs;
  }
}
