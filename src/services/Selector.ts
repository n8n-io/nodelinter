import ts, { getLineAndCharacterOfPosition } from "typescript";
import { Traverser } from ".";
import { NEXT_LINE_LINT_EXCEPTION_TEXT } from "../constants";

export class Selector {
  /**
   * Retrieve the (ending) line number for the node.
   */
  static lineNumber(node: ts.Node) {
    const { line } = getLineAndCharacterOfPosition(
      Traverser.sourceFile,
      node.getEnd()
    );
    return line;
  }

  /**
   * Select all comments in the source.
   */
  static comments(node: ts.Node) {
    return (
      ts
        .getLeadingCommentRanges(
          Traverser.sourceFile.getFullText(),
          node.getFullStart()
        )
        ?.map((range) => ({
          ...range,
          text: Traverser.sourceFile.getFullText().slice(range.pos, range.end),
          line: Selector.lineNumber(node),
          node,
        })) ?? []
    );
  }

  /**
   * Select all `// nodelinter-ignore-next-line` lint exceptions in the source.
   */
  static lintExceptions(node: ts.Node): LintException[] {
    return Selector.comments(node)
      .filter((comment) =>
        comment.text.startsWith(NEXT_LINE_LINT_EXCEPTION_TEXT)
      )
      .map(({ line, text }) => {
        return {
          line,
          lintingName: text.split(" ").pop()!,
          exceptionType: "nextLine",
        };
      });
  }

  /**
   * Select all `// TODO` comments in the source.
   */
  static toDos(node: ts.Node) {
    return Selector.comments(node)
      .filter((comment) => comment.text.startsWith("// TODO"))
      .map(({ text, line }) => ({ text, line }));
  }

  /**
   * Select all `// @ts-ignore` comments in the source.
   */
  static tsIgnores(node: ts.Node) {
    return Selector.comments(node)
      .filter((comment) => comment.text.startsWith("// @ts-ignore"))
      .map(({ line, text }) => {
        return {
          line,
          text,
        };
      });
  }

  /**
   * Check if the node is a property assignment where
   * - the key-value pair matches, or
   * - the key matches.
   *
   * Note: For the value, `getText()` returns a string from the source, so it returns
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
