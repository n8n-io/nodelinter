import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { config } from "../config";
import { lintAreaIsDisabled, lintIssueIsDisabled } from "../utils";
import { Traverser } from "../services";

// type SubValidatorConstructor<T = {}> = new (...args: any[]) => T;

type Constructor = new (...args: any[]) => {};

export function Logger<BaseClass extends Constructor>(
  Base: BaseClass,
  sourceFilePath: string
) {
  return class extends Base {
    logs: Log[] = [];

    public log = (linting: Linting) => (node: ts.Node) => {
      const { line } = getLine(
        Traverser.sourceFile,
        node.getChildAt(2).getEnd()
      );

      if (lintIssueIsDisabled(linting.lintIssue)) return;

      for (const lintArea of linting.lintAreas) {
        if (lintAreaIsDisabled(lintArea)) return;
      }

      this.logs.push({
        message: linting.message,
        lintAreas: linting.lintAreas,
        lintIssue: linting.lintIssue,
        line: line + 1,
        excerpt: config.truncation.enabled
          ? this.truncate(node.getText())
          : node.getText(),
        sourceFilePath: sourceFilePath,
        logLevel: linting.logLevel,
      });
    };

    private truncate = (text: string) => {
      if (text.includes("\t")) return "<large excerpt omitted>";

      return text.slice(0, config.truncation.charLimit);
    };
  };
}
