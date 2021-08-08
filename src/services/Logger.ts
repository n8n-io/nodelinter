import ts from "typescript";
import { masterConfig } from "../";
import { Traverser } from "../services";
import { Collector } from "./Collector";
import { ConfigManager } from "./ConfigManager";

// type SubValidatorConstructor<T = {}> = new (...args: any[]) => T;

export function Logger<BaseClass extends Constructor>(Base: BaseClass) {
  return class extends Base {
    logs: Log[] = [];

    public log = (linting: Linting) => (node: ts.Node) => {
      let line = Collector.getLineNumber(node.getChildAt(2));

      line += 1; // TODO: Find out why this offset is needed

      if (
        ConfigManager.lintIssueIsDisabled(linting.lintIssue, masterConfig) ||
        ConfigManager.logLevelIsDisabled(linting.logLevel, masterConfig) ||
        ConfigManager.lintingIsDisabled(linting, masterConfig) ||
        ConfigManager.lintingIsExcepted(
          linting,
          line,
          Collector.exceptions,
          masterConfig
        )
      )
        return;

      this.logs.push({
        message: linting.message,
        lintAreas: linting.lintAreas,
        lintIssue: linting.lintIssue,
        line,
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
