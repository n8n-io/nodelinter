import ts from "typescript";
import { Traverser } from ".";
import { Selector } from "./Selector";

/**
 * Collects tokens that require full AST traversal before validation,
 * e.g., lint exceptions and `continueOnFail` identifiers.
 */
export class Collector {
  public static exceptions: Exception[];
  public static tsIgnores: Array<{ line: number; text: string }>;
  public static toDos: Array<{ line: number; text: string }>;
  public static loadOptionsMethods: string[] = [];
  public static sourceFileHasContinueOnFail = false;
  public static currentNode: ts.Node;

  public static setNode(node: ts.Node) {
    Collector.currentNode = node;
    return Collector;
  }

  public static run() {
    const node = Collector.currentNode;

    Collector.exceptions = Selector.exceptions(node);
    Collector.tsIgnores = Selector.tsIgnores(node);
    Collector.toDos = Selector.toDos(node);

    if (
      Traverser.sourceFilePath.endsWith(".node.ts") &&
      ts.isIdentifier(node) &&
      node.getText() === "loadOptions"
    ) {
      const objectLiteralExpression = node.parent.getChildAt(2);
      objectLiteralExpression.forEachChild((methodDeclaration) => {
        const identifier = methodDeclaration.getChildAt(1);
        Collector.loadOptionsMethods.push(identifier.getText());
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
