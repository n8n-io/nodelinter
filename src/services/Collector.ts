import ts from "typescript";
import { Traverser } from ".";
import { Selector } from "./Selector";

/**
 * Collects tokens that require full AST traversal before validation,
 * e.g., lint exceptions and `continueOnFail` identifiers.
 */
export class Collector {
  private static lintExceptionsMap = new Map();
  public static sourceFileHasContinueOnFail = false;

  static get lintExceptions(): LintException[] {
    return Object.values(Object.fromEntries(Collector.lintExceptionsMap));
  }

  static run(node: ts.Node) {
    const lintExceptions = Selector.lintExceptions(node);

    if (lintExceptions?.length) {
      lintExceptions.forEach((exception) => {
        const key = `${exception.line}-${exception.lintingName}`;
        Collector.lintExceptionsMap.set(key, exception);
      });
    }

    if (
      Traverser.sourceFilePath.endsWith(".node.ts") &&
      ts.isPropertyAccessExpression(node) &&
      node.getChildAt(2).getText() === "continueOnFail"
    ) {
      Collector.sourceFileHasContinueOnFail = true;
    }
  }
}
