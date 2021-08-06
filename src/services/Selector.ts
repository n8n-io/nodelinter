import ts, { getLineAndCharacterOfPosition } from "typescript";
import { Traverser } from ".";
import { NEXT_LINE_LINT_EXCEPTION_TEXT } from "../constants";

export class Selector {
  static lineNumber(node: ts.Node) {
    const { line } = getLineAndCharacterOfPosition(
      Traverser.sourceFile,
      node.getEnd()
    );
    return line;
  }

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

  static lintExceptions(node: ts.Node): LintException[] {
    return Selector.comments(node)
      .filter((comment) =>
        comment.text.startsWith(NEXT_LINE_LINT_EXCEPTION_TEXT)
      )
      .map(({ line, text }) => {
        return {
          line,
          lintingName: text.split(" ").pop()!,
          type: "nextLine",
        };
      });
  }
}
