import ts from "typescript";
import { areAlphabetized, isCamelCase, isTitleCase } from "../../utils";
import { LINTINGS } from "../../lintings";
import { STANDARD_DESCRIPTIONS } from "../../constants";

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
      let fixedCollectionValuesNames: string[] = [];
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
                      if (child.getChildAt(0).getText() === "displayName") {
                        if (
                          !isTitleCase(
                            child.getChildAt(2).getText().replace(/'/g, "")
                          )
                        ) {
                          this.log(
                            LINTINGS.FIXED_COLLECTION_VALUE_DISPLAY_NAME_WITH_NO_TITLECASE
                          )(child);
                        }
                      }

                      if (child.getChildAt(0).getText() === "displayName") {
                        fixedCollectionValuesNames.push(
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

      if (!areAlphabetized(fixedCollectionValuesNames)) {
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
      let collectionOptionsNames: string[] = [];

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
              collectionOptionsNames.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
              );
            }
          });
        });
      });

      if (!areAlphabetized(collectionOptionsNames)) {
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
      let optionsNames: string[] = [];

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
              optionsNames.push(
                node.getChildAt(2).getText().replace(/'/g, "") // remove single quotes from string
              );

              if (
                !isTitleCase(node.getChildAt(2).getText().replace(/'/g, ""))
              ) {
                this.log(LINTINGS.OPTIONS_NAME_WITH_NO_TITLECASE)(node);
              }
            }

            if (
              ts.isPropertyAssignment(node) &&
              node.getChildAt(0).getText() === "value"
            ) {
              if (
                !isCamelCase(node.getChildAt(2).getText().replace(/'/g, ""))
              ) {
                this.log(LINTINGS.OPTIONS_VALUE_WITH_NO_CAMELCASE)(node);
              }

              if (node.getChildAt(2).getText() === "'upsert'") {
                node.parent.forEachChild((child) => {
                  if (child.getChildAt(0).getText() === "name") {
                    if (
                      child.getChildAt(2).getText() !==
                      `'${STANDARD_DESCRIPTIONS.upsertOptionName}'`
                    ) {
                      this.log(LINTINGS.NON_STANDARD_NAME_FOR_UPSERT_OPTION)(
                        child
                      );
                    }
                  }

                  if (child.getChildAt(0).getText() === "description") {
                    if (
                      child.getChildAt(2).getText() !==
                      `'${STANDARD_DESCRIPTIONS.upsertOptionDescription}'`
                    ) {
                      this.log(
                        LINTINGS.NON_STANDARD_DESCRIPTION_FOR_UPSERT_OPTION
                      )(child);
                    }
                  }
                });
              }
            }
          });
        });
      });

      if (isOptionsType && !areAlphabetized(optionsNames)) {
        this.log(LINTINGS.NON_ALPHABETIZED_OPTIONS_IN_OPTIONS_TYPE_PARAM)(
          nodeToReport
        );
      }

      if (isMultiOptionsType && !areAlphabetized(optionsNames)) {
        this.log(LINTINGS.NON_ALPHABETIZED_OPTIONS_IN_MULTIOPTIONS_TYPE_PARAM)(
          nodeToReport
        );
      }
    }
    return this.logs;
  }
}
