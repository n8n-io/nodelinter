import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { config } from "../config";
import {
  lintAreaIsDisabled,
  lintIssueIsDisabled,
  logLevelIsDisabled,
} from "../utils";
import { Traverser } from "../services";

// type SubValidatorConstructor<T = {}> = new (...args: any[]) => T;

type Constructor = new (...args: any[]) => {};

export function Logger<BaseClass extends Constructor>(Base: BaseClass) {
  return class extends Base {
    logs: Log[] = [];

    public log = (linting: Linting) => (node: ts.Node) => {
      const { line } = getLine(
        Traverser.sourceFile,
        node.getChildAt(2).getEnd()
      );

      if (lintIssueIsDisabled(linting.lintIssue)) return;
      if (logLevelIsDisabled(linting.logLevel)) return;

      for (const lintArea of linting.lintAreas) {
        if (lintAreaIsDisabled(lintArea)) return;
      }

      linting.enabled &&
        this.logs.push({
          message: linting.message,
          lintAreas: linting.lintAreas,
          lintIssue: linting.lintIssue,
          line: line + 1,
          excerpt: config.truncateExcerpts.enabled
            ? this.truncateExcerpt(node.getText())
            : node.getText(),
          sourceFilePath: Traverser.sourceFilePath,
          logLevel: linting.logLevel,
          ...(linting.details && { details: linting.details }),
        });
    };

    truncateExcerpt(text: string) {
      if (text.includes("\t")) return "<large excerpt omitted>";
      if (text.length <= config.truncateExcerpts.charLimit) return text;

      return text.slice(0, config.truncateExcerpts.charLimit - 3) + "...";
    }
  };
}
