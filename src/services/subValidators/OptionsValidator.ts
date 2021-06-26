import ts from "typescript";
import { areAlphabetized } from "../../utils";
import { LINTINGS } from "../../lintings";

export class OptionsValidator implements SubValidator {
  static lintArea = "options" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type" &&
      node.getChildAt(2).getText() === "'fixedCollection'"
    ) {
      let fixedCollectionValuesValues: string[] = [];
      let nodeToReport: ts.Node = node;

      node.parent.forEachChild((child) => {
        if (child.getChildAt(0).getText() === "options") {
          child
            .getChildAt(2)
            .getChildAt(1)
            .getChildAt(0)
            .forEachChild((child) => {
              if (child.getChildAt(0).getText() === "values") {
                nodeToReport = child.getChildAt(2);
                child.getChildAt(2).forEachChild((child) => {
                  if (ts.isObjectLiteralExpression(child)) {
                    child.forEachChild((child) => {
                      if (child.getChildAt(0).getText() === "name") {
                        fixedCollectionValuesValues.push(
                          child.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
                        );
                      }
                    });
                  }
                });
              }
            });
        }
      });

      if (!areAlphabetized(fixedCollectionValuesValues)) {
        this.log(
          LINTINGS.NON_ALPHABETIZED_VALUES_IN_FIXED_COLLECTION_TYPE_PARAM
        )(nodeToReport);
      }
    }

    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type" &&
      node.getChildAt(2).getText() === "'collection'"
    ) {
      let nodeToReport: ts.Node = node;
      let collectionOptionsValues: string[] = [];

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() !== "options") return;
        if (!ts.isArrayLiteralExpression(node.getChildAt(2))) return;

        nodeToReport = node;
        node.getChildAt(2).forEachChild((node) => {
          if (!ts.isObjectLiteralExpression(node)) return;

          node.forEachChild((node) => {
            if (
              ts.isPropertyAssignment(node) &&
              node.getChildAt(0).getText() === "name"
            ) {
              collectionOptionsValues.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
              );
            }
          });
        });
      });

      if (!areAlphabetized(collectionOptionsValues)) {
        this.log(LINTINGS.NON_ALPHABETIZED_OPTIONS_IN_COLLECTION_TYPE_PARAM)(
          nodeToReport
        );
      }
    }

    if (
      ts.isPropertyAssignment(node) &&
      node.getChildAt(0).getText() === "type" &&
      (node.getChildAt(2).getText() === "'options'" ||
        node.getChildAt(2).getText() === "'multiOptions'")
    ) {
      let isOptionsType = node.getChildAt(2).getText() === "'options'";
      let isMultiOptionsType =
        node.getChildAt(2).getText() === "'multiOptions'";

      let nodeToReport: ts.Node = node;
      let optionsValues: string[] = [];

      node.parent.forEachChild((node) => {
        if (node.getChildAt(0).getText() !== "options") return;
        if (!ts.isArrayLiteralExpression(node.getChildAt(2))) return;

        nodeToReport = node;
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
                      this.log(LINTINGS.UPSERT_OPTION_WITH_MISWORDED_NAME)(
                        child
                      );
                    }
                  }

                  if (child.getChildAt(0).getText() === "description") {
                    if (
                      child.getChildAt(2).getText() !==
                      "Create a new record, or update the current one if it already exists (upsert)"
                    ) {
                      this.log(
                        LINTINGS.UPSERT_OPTION_WITH_MISWORDED_DESCRIPTION
                      )(child);
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

      if (isOptionsType && !areAlphabetized(optionsValues)) {
        this.log(LINTINGS.NON_ALPHABETIZED_OPTIONS_IN_OPTIONS_TYPE_PARAM)(
          nodeToReport
        );
      }

      if (isMultiOptionsType && !areAlphabetized(optionsValues)) {
        this.log(LINTINGS.NON_ALPHABETIZED_OPTIONS_IN_MULTIOPTIONS_TYPE_PARAM)(
          nodeToReport
        );
      }
    }
    return this.logs;
  }
}
