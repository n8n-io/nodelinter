import ts from "typescript";
import { Traverser } from ".";
import { Selector } from "./Selector";

/**
 * Collects tokens that require full AST traversal before validation,
 * e.g., lint exceptions and `continueOnFail` identifiers.
 */
export class Collector {
  private static lintExceptionsMap = new Map();
  private static tsIgnoresMap = new Map();
  public static sourceFileHasContinueOnFail = false;

  static get lintExceptions(): LintException[] {
    return Object.values(Object.fromEntries(Collector.lintExceptionsMap));
  }

  static get tsIgnores(): Array<{ line: number; text: string }> {
    return Object.values(Object.fromEntries(Collector.tsIgnoresMap));
  }

  static run(node: ts.Node) {
    const lintExceptions = Selector.lintExceptions(node);
    const tsIgnores = Selector.tsIgnores(node);

    if (tsIgnores?.length) {
      tsIgnores.forEach((tsIgnore) => {
        const key = `${tsIgnore.line}-${tsIgnore.text}`;
        Collector.tsIgnoresMap.set(key, tsIgnore);
      });
    }

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
