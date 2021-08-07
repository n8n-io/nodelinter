import ts from "typescript";
import { Traverser } from ".";
import { Selector } from "./Selector";

/**
 * Collects tokens that require full AST traversal before validation,
 * e.g., lint exceptions and `continueOnFail` identifiers.
 */
export class Collector {
  public static sourceFileHasContinueOnFail = false;

  public static exceptions: Exception[];
  public static tsIgnores: Array<{ line: number; text: string }>;
  public static toDos: Array<{ line: number; text: string }>;

  static run(node: ts.Node) {
    Collector.exceptions = Selector.exceptions(node);
    Collector.tsIgnores = Selector.tsIgnores(node);
    Collector.toDos = Selector.toDos(node);

    if (
      Traverser.sourceFilePath.endsWith(".node.ts") &&
      ts.isPropertyAccessExpression(node) &&
      node.getChildAt(2).getText() === "continueOnFail"
    ) {
      Collector.sourceFileHasContinueOnFail = true;
    }
  }
}
