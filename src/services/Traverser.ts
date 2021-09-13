import ts, { getLineAndCharacterOfPosition as getLine } from "typescript";
import { Validator } from "../services";
import { Collector } from "./Collector";
import { Navigator } from "./Navigator";

export class Traverser {
  static sourceFile: ts.SourceFile;
  static sourceFilePath = "";
  static extractedDescriptions: ExtractedDescription[] = [];

  static traverse(validator: Validator): ts.TransformerFactory<ts.SourceFile> {
    return (context) => {
      return (sourceFile) => {
        this.sourceFile = sourceFile;

        const collectorVisitor: ts.Visitor = (node) => {
          Collector.run(node);
          return ts.visitEachChild(node, collectorVisitor, context);
        };

        const validatorVisitor: ts.Visitor = (node) => {
          validator.setNode(node).run();
          return ts.visitEachChild(node, validatorVisitor, context);
        };

        ts.visitNode(sourceFile, collectorVisitor);
        ts.visitNode(sourceFile, validatorVisitor); // main traversal
        validator.postTraversalChecks(sourceFile);

        return sourceFile;
      };
    };
  }

  /**
   * Extract all param descriptions.
   */
  static extract(): ts.TransformerFactory<ts.SourceFile> {
    return (context) => {
      return (sourceFile) => {
        this.sourceFile = sourceFile;

        const extractorVisitor: ts.Visitor = (node) => {
          if (Navigator.isAssignment(node, { key: "description" })) {
            const description = node.getChildAt(2).getText().clean();
            if (!description) return;

            let { line } = getLine(sourceFile, node.getEnd());
            line += 1;

            // @ts-ignore
            Traverser.extractedDescriptions.push(description);

            // Traverser.extractedDescriptions.push({
            //   description,
            //   line,
            //   sourceFilePath: Traverser.sourceFilePath.split("n8n").pop()!,
            // });
          }

          return ts.visitEachChild(node, extractorVisitor, context);
        };

        ts.visitNode(sourceFile, extractorVisitor);

        return sourceFile;
      };
    };
  }
}

String.prototype.unquote = function (this: string) {
  return this.replace(/(^'|'$)/g, "");
};

String.prototype.clean = function (this: string) {
  return this.trim().unquote();
};
