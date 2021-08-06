import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { Traverser } from ".";
import { NEXT_LINE_LINT_EXCEPTION_TEXT } from "../constants";

export class Selector {
  static lintExceptions(node: ts.Node): LintException[] {
    return Selector.comments(node)
      .filter((comment) =>
        comment.text.startsWith(NEXT_LINE_LINT_EXCEPTION_TEXT)
      )
      .map((lintException) => {
        return {
          line: lintException.line,
          lintingName: lintException.text.split(" ").pop()!,
          type: "nextLine",
        };
      });
  }

  static comments(node: ts.Node) {
    const { line } = getLine(Traverser.sourceFile, node.getEnd());

    return (
      ts
        .getLeadingCommentRanges(
          Traverser.sourceFile.getFullText(),
          node.getFullStart()
        )
        ?.map((range) => ({
          ...range,
          text: Traverser.sourceFile.getFullText().slice(range.pos, range.end),
          line,
          node,
        })) ?? []
    );
  }
}
