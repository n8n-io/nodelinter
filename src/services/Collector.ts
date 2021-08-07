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
  private static toDosMap = new Map();
  public static sourceFileHasContinueOnFail = false;

  static get lintExceptions(): LintException[] {
    return Object.values(Object.fromEntries(Collector.lintExceptionsMap));
  }

  static get tsIgnores(): Array<{ line: number; text: string }> {
    return Object.values(Object.fromEntries(Collector.tsIgnoresMap));
  }

  static get toDos(): Array<{ line: number; text: string }> {
    return Object.values(Object.fromEntries(Collector.toDosMap));
  }

  static run(node: ts.Node) {
    const lintExceptions = Selector.lintExceptions(node);
    const tsIgnores = Selector.tsIgnores(node);
    const toDos = Selector.toDos(node);

    if (lintExceptions?.length) {
      lintExceptions.forEach((exception) => {
        const key = `${exception.line}-${exception.lintingName}`;
        Collector.lintExceptionsMap.set(key, exception);
      });
    }

    if (tsIgnores?.length) {
      tsIgnores.forEach((tsIgnore) => {
        const key = `${tsIgnore.line}-${tsIgnore.text}`;
        Collector.tsIgnoresMap.set(key, tsIgnore);
      });
    }

    if (toDos?.length) {
      toDos.forEach((toDo) => {
        const key = `${toDo.line}-${toDo.text}`;
        Collector.toDosMap.set(key, toDo);
      });
      console.log(Collector.toDosMap);
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
