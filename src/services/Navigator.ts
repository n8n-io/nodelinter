import ts from "typescript";

/**
 * Bundle of utility methods to navigate the AST.
 */
export class Navigator {
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
   * Note: For the value, `getText()` returns a string from the source, i.e.
   * - a twice-quoted string for a string in the source (e.g. `'value'` → `"'value'"`), and
   * - a normal string for a non-string in the source (e.g. `false` → `'false'`).
   *
   * Therefore, the value to compare to needs to be twice-quoted or stringified.
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
