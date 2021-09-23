import ts, { getLineAndCharacterOfPosition } from "typescript";
import { Traverser } from ".";
import { NEXT_LINE_EXCEPTION_TEXT } from "../constants";
import { Navigator } from "./Navigator";

export class Collector {
  private static commentsMap = new Map();

  public static loadOptionsMethods: string[] = [];
  public static credentialsTestMethods: string[] = [];
  public static sourceFileHasContinueOnFail = false;
  public static currentNode: ts.Node;
  public static isRegularNode = false;
  public static isTriggerNode = false;
  public static credentialsTestNamesSet: Set<string> = new Set();

  public static run(node: ts.Node) {
    Collector.identifyRegularOrTrigger(node);
    Collector.collectComments(node);
    Collector.collectContinueOnFail(node);
    Collector.collectCredentialsTestName(node);
    Collector.collectLoadOptionsMethods(node);
    Collector.collectCredentialsTestMethods(node);
  }

  static get credentialsTestNames() {
    return [...Collector.credentialsTestNamesSet];
  }

  static get comments(): Comment[] {
    return Object.values(Object.fromEntries(Collector.commentsMap));
  }

  static identifyRegularOrTrigger(node: ts.Node) {
    if (ts.isClassDeclaration(node)) {
      node.forEachChild((child) => {
        if (ts.isIdentifier(child)) {
          if (child.getText().endsWith("Trigger")) {
            Collector.isTriggerNode = true;
          } else {
            Collector.isRegularNode = true;
          }
        }
      });
    }
  }

  static collectCredentialsTestName(node: ts.Node) {
    if (!Traverser.sourceFilePath.endsWith(".node.ts")) return;

    const found = Navigator.findDescendant(node, { text: "testedBy" });

    if (found) {
      Collector.credentialsTestNamesSet.add(found.parent.getChildAt(2).getText().clean())
    }
  }

  static collectContinueOnFail(node: ts.Node) {
    if (
      Traverser.sourceFilePath.endsWith(".node.ts") &&
      ts.isPropertyAccessExpression(node) &&
      node.getChildAt(2).getText() === "continueOnFail"
    ) {
      Collector.sourceFileHasContinueOnFail = true;
    }
  }

  static collectLoadOptionsMethods(node: ts.Node) {
    if (
      Traverser.sourceFilePath.endsWith(".node.ts") &&
      ts.isIdentifier(node) &&
      node.getText() === "loadOptions"
    ) {
      const objectLiteralExpression = node.parent.getChildAt(2);
      objectLiteralExpression.forEachChild((method) => {
        if (ts.isShorthandPropertyAssignment(method)) {
          Collector.loadOptionsMethods.push(method.getText());
        } else {
          const identifier = method.getChildAt(1);
          Collector.loadOptionsMethods.push(identifier.getText());
        }
      });
    }
  }

  static collectCredentialsTestMethods(node: ts.Node) {
    if (
      Traverser.sourceFilePath.endsWith(".node.ts") &&
      ts.isIdentifier(node) &&
      node.getText() === "credentialTest"
    ) {
      const objectLiteralExpression = node.parent.getChildAt(2);

      objectLiteralExpression.forEachChild((method) => {
        if (ts.isShorthandPropertyAssignment(method)) {
          Collector.credentialsTestMethods.push(method.getText());
        } else {
          const identifier = method.getChildAt(1);
          Collector.credentialsTestMethods.push(identifier.getText());
        }
      });
    }
  }

  /**
   * Retrieve the ending line number for the node.
   */
  static getLineNumber(node: ts.Node) {
    const { line } = getLineAndCharacterOfPosition(
      Traverser.sourceFile,
      node?.getEnd() ?? 0 // TODO: Detect undefined node upstream
    );
    return line;
  }

  static collectComments(node: ts.Node) {
    const commentRanges =
      ts.getLeadingCommentRanges(
        Traverser.sourceFile.getFullText(),
        node.getFullStart()
      ) ?? [];

    const comments = commentRanges.map((range) => ({
      text: Traverser.sourceFile.getFullText().slice(range.pos, range.end),
      line: Collector.getLineNumber(node),
      pos: range.pos,
      end: range.end,
    }));

    // dedup with map because API may report
    // multiple comment ranges for a single comment

    comments.forEach((comment) => {
      const key = `${comment.pos}-${comment.end}`;
      Collector.commentsMap.set(key, comment);
    });
  }

  // ----------------------------------
  //           getters
  // ----------------------------------

  static get exceptions(): Exception[] {
    return Collector.comments
      .filter((comment) => comment.text.startsWith(NEXT_LINE_EXCEPTION_TEXT))
      .map(({ line, text }) => {
        const parts = text.split(" ");
        let lintingsToExcept: string[] = [];

        if (parts.length === 2) {
          lintingsToExcept = ["*"];
        } else if (parts.length === 3) {
          lintingsToExcept = [parts.pop()!];
        } else if (parts.length > 3) {
          lintingsToExcept = parts.slice(2);
        }

        return {
          line,
          lintingsToExcept,
          exceptionType: "nextLine",
        };
      });
  }

  static get toDos(): ToDoComment[] {
    return Collector.comments
      .filter((comment) => comment.text.startsWith("// TODO"))
      .map(({ line, text }) => ({ line, text }));
  }

  static get tsIgnores() {
    return Collector.comments
      .filter((comment) => comment.text.startsWith("// @ts-ignore"))
      .map(({ line, text }) => ({ line, text }));
  }
}
