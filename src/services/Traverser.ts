import ts from "typescript";
import { Validator } from "../services";

export class Traverser {
  static sourceFile: ts.SourceFile;

  static traverse(validator: Validator): ts.TransformerFactory<ts.SourceFile> {
    return (context) => {
      return (sourceFile) => {
        this.sourceFile = sourceFile;

        const visitor: ts.Visitor = (node) => {
          validator.setNode(node).run();
          return ts.visitEachChild(node, visitor, context);
        };

        return ts.visitNode(sourceFile, visitor);
      };
    };
  }
}
