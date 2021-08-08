import ts from "typescript";
import { Validator } from "../services";
import { Collector } from "./Collector";

export class Traverser {
  static sourceFile: ts.SourceFile;
  static sourceFilePath = "";

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
}
