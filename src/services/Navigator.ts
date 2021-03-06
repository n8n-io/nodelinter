import ts from "typescript";

/**
 * Bundle of utility methods to navigate the AST.
 */
export class Navigator {
  /**
   * Find a matching descendant node.
   */
  static findDescendant(
    node: ts.Node,
    testType: { [key in "text"]: string }
  ): ts.Node | undefined {
    if (node.getChildCount() === 0) return;

    return node.forEachChild((child) => {
      return Navigator.getTest(testType)(child)
        ? child
        : Navigator.findDescendant(child, testType);
    });
  }

  static getTest = (testType: { [key in "text"]: string }) => {
    if (testType.text)
      return (node: ts.Node) => node.getText() === testType.text;

    throw new Error("Unknown test type");
  };

  static isBooleanKeyword(node: ts.Node) {
    return (
      node.kind === ts.SyntaxKind.TrueKeyword ||
      node.kind === ts.SyntaxKind.FalseKeyword
    );
  }

  /**
   * Check if the node is a property assignment where
   * - the key-value pair matches, or
   * - the key matches.
   *
   * Note: The value to compare to needs to be twice-quoted (if a string) or stringified (if not a string).
   * `getText()` returns a string from the source, so
   * - a twice-quoted string for a string in the source (e.g. `'value'` → `"'value'"`), and
   * - a normal string for a non-string in the source (e.g. `false` → `'false'`).
   */
  static isAssignment(
    node: ts.Node,
    { key, value }: { key?: string; value?: string | boolean }
  ) {
    if (key !== undefined && value !== undefined) {
      const isString = typeof value === "string";

      return (
        ts.isPropertyAssignment(node) &&
        node.getChildAt(0).getText() === key &&
        node.getChildAt(2).getText() ===
          (isString ? `'${value}'` : value.toString())
      );
    }

    if (key !== undefined && value === undefined) {
      return (
        ts.isPropertyAssignment(node) && node.getChildAt(0).getText() === key
      );
    }
  }
}
