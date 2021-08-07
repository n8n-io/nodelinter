import ts from "typescript";
import { Validator } from "../services";

export class Traverser {
  static sourceFile: ts.SourceFile;
  static sourceFilePath = "";

  static traverse(validator: Validator): ts.TransformerFactory<ts.SourceFile> {
    return (context) => {
      return (sourceFile) => {
        this.sourceFile = sourceFile;

        const visitor: ts.Visitor = (node) => {
          validator.setNode(node).run();
          return ts.visitEachChild(node, visitor, context);
        };

        ts.visitNode(sourceFile, visitor); // full traversal, using subValidators
        validator.postTraversalChecks(sourceFile); // post traversal, using Collector

        return sourceFile;
      };
    };
  }
}
