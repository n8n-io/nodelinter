import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { masterConfig } from "../";
import {
  lintAreaIsDisabled,
  lintingIsDisabled,
  lintIssueIsDisabled,
  logLevelIsDisabled,
} from "../utils";
import { Traverser } from "../services";

// type SubValidatorConstructor<T = {}> = new (...args: any[]) => T;

export function Logger<BaseClass extends Constructor>(Base: BaseClass) {
  return class extends Base {
    logs: Log[] = [];

    public log = (linting: Linting) => (node: ts.Node) => {
      const { line } = getLine(
        Traverser.sourceFile,
        node.getChildAt(2).getEnd()
      );

      // lintArea check at Validator.run()
      if (
        lintIssueIsDisabled(linting.lintIssue, masterConfig) ||
        logLevelIsDisabled(linting.logLevel, masterConfig) ||
        lintingIsDisabled(linting, masterConfig)
      )
        return;

      this.logs.push({
        message: linting.message,
        lintAreas: linting.lintAreas,
        lintIssue: linting.lintIssue,
        line: line + 1,
        excerpt: masterConfig.truncateExcerpts.enabled
          ? this.truncateExcerpt(node.getText())
          : node.getText(),
        sourceFilePath: Traverser.sourceFilePath,
        logLevel: linting.logLevel,
        ...(linting.details && { details: linting.details }),
      });
    };

    truncateExcerpt(text: string) {
      if (text.includes("\t")) return "<large excerpt omitted>";
      if (text.length <= masterConfig.truncateExcerpts.charLimit) return text;

      return text.slice(0, masterConfig.truncateExcerpts.charLimit - 3) + "...";
    }
  };
}
