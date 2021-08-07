import ts, { getLineAndCharacterOfPosition } from "typescript";
import { Traverser } from ".";
import { NEXT_LINE_LINT_EXCEPTION_TEXT } from "../constants";

export class Selector {
  static commentsMap = new Map();

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
  static comments(node: ts.Node): Comment[] {
    const comments =
      ts
        .getLeadingCommentRanges(
          Traverser.sourceFile.getFullText(),
          node.getFullStart()
        )
        ?.map((range) => ({
          text: Traverser.sourceFile.getFullText().slice(range.pos, range.end),
          line: Selector.lineNumber(node),
          pos: range.pos,
          end: range.end,
        })) ?? [];

    // dedup because API may report multiple comment ranges for a single comment

    if (comments?.length) {
      comments.forEach((comment) => {
        const key = `${comment.pos}-${comment.end}`;
        Selector.commentsMap.set(key, comment);
      });
    }

    return Object.values(Object.fromEntries(Selector.commentsMap));
  }

  /**
   * Select all next line exceptions in the source.
   */
  static exceptions(node: ts.Node): Exception[] {
    return Selector.comments(node)
      .filter((comment) =>
        comment.text.startsWith(NEXT_LINE_LINT_EXCEPTION_TEXT)
      )
      .map(({ line, text }) => {
        const parts = text.split(" ");
        let lintingsToExcept: string[] = [];

        if (parts.length === 2) {
          lintingsToExcept = ["*"];
        } else if (parts.length === 3) {
          lintingsToExcept = [parts.pop()!];
        } else if (parts.length > 3) {
          lintingsToExcept = parts.slice(2);
        }

        return {
          line,
          lintingsToExcept,
          exceptionType: "nextLine",
        };
      });
  }

  /**
   * Select all TODO comments in the source.
   */
  static toDos(node: ts.Node) {
    // const comments = Selector.comments(node);
    // console.log(comments);
    return Selector.comments(node)
      .filter((comment) => comment.text.startsWith("// TODO"))
      .map(({ text, line }) => ({ text, line }));
  }

  /**
   * Select all `@ts-ignore` comments in the source.
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
