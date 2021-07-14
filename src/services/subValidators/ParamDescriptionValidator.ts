import ts from "typescript";
import {
  STANDARD_DESCRIPTIONS,
  TECHNICAL_TERMS,
  WEAK_DESCRIPTIONS,
} from "../../constants";
import { LINTINGS } from "../../lintings";
import { hasAnchorLink, hasTargetBlank, startsWithCapital } from "../../utils";

export class DescriptionValidator implements SubValidator {
  static lintArea = "paramDescription" as const;
  logs: Log[];
  log: LogFunction;

  /**
   * Validate that a single-sentence description has no final period, and
   * that a multiple-sentence description has final periods for all sentences.
   */
  private checkFinalPeriod(description: string, node: ts.Node) {
    const sentences = description.split(". ");

    if (!sentences.length) return;

    if (sentences.length === 1 && !sentences[0].endsWith(".")) return;

    if (sentences.length === 1 && sentences[0].endsWith(".")) {
      this.log(LINTINGS.PARAM_DESCRIPTION_WITH_EXCESS_FINAL_PERIOD)(node);
      return;
    }

    const [last, ...allButLast] = [sentences.pop()!, ...sentences];

    // restore periods removed by split() in all but last
    const restored = [...allButLast.map((s) => (s += ".")), last];

    if (!restored.every((sentence) => sentence.endsWith("."))) {
      this.log(LINTINGS.PARAM_DESCRIPTION_WITH_MISSING_FINAL_PERIOD)(node);
    }
  }

  public run(node: ts.Node) {
    // skip object inside arrow function that happens to have `name` property
    const isNameInArrowFunction =
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.getChildAt(0)) &&
      node.getChildAt(0).getText() === "name" &&
      node?.parent?.parent?.parent?.kind === ts.SyntaxKind.ArrowFunction;

    if (isNameInArrowFunction) console.log(node.getText());

    // skip object inside `execute()` that happens to have `name` property
    const isNameWithVariableDeclarationParent =
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.getChildAt(0)) &&
      node.getChildAt(0).getText() === "name" &&
      (node?.parent?.parent?.kind === ts.SyntaxKind.VariableDeclaration ||
        node?.parent?.parent?.parent?.kind ===
          ts.SyntaxKind.VariableDeclaration);

    // skip object in `credentials` in node description
    const hasCredentialsParent = node?.parent?.parent?.parent
      ?.getText()
      .startsWith("credentials");

    // skip object in `defaults` in node description
    const hasDefaultsParent = node?.parent?.parent
      ?.getText()
      .startsWith("defaults");

    if (!ts.isPropertyAssignment(node)) return;

    if (
      node.getChildAt(0).getText() === "name" &&
      node.getChildAt(2).getText() === "'simple'"
    ) {
      node.parent.forEachChild((node) => {
        if (
          node.getChildAt(0).getText() === "description" &&
          node.getChildAt(2).getText() !==
            `'${STANDARD_DESCRIPTIONS.simplifyResponse}'`
        )
          this.log(LINTINGS.NON_STANDARD_DESCRIPTION_FOR_SIMPLIFY_PARAM)(node);
      });
    }

    if (node.getChildAt(0).getText() === "description") {
      node.parent.forEachChild((child) => {
        if (child.getChildAt(0).getText() === "displayName") {
          if (node.getChildAt(2).getText() === child.getChildAt(2).getText()) {
            this.log(LINTINGS.PARAM_DESCRIPTION_IDENTICAL_TO_DISPLAY_NAME)(
              node
            );
          }
        }
      });

      if (node.getChildAt(2).getText().includes("<br />")) {
        this.log(LINTINGS.NON_STANDARD_HTML_LINE_BREAK)(node);
      }

      TECHNICAL_TERMS.forEach((technicalTerm) => {
        if (node.getChildAt(2).getText().includes(technicalTerm)) {
          this.log(LINTINGS.TECHNICAL_TERM_IN_PARAM_DESCRIPTION)(node);
        }
      });

      WEAK_DESCRIPTIONS.forEach((weakDescription) => {
        if (node.getChildAt(2).getText().includes(weakDescription)) {
          this.log(LINTINGS.WEAK_PARAM_DESCRIPTION)(node);
        }
      });

      if (
        node.getChildAt(2).getText().startsWith("' ") ||
        node.getChildAt(2).getText().endsWith(" '")
      ) {
        this.log(LINTINGS.PARAM_DESCRIPTION_UNTRIMMED)(node);
      }

      if (
        node.getChildAt(2).getText().split(" ").includes("id") ||
        node.getChildAt(2).getText().split(" ").includes("Id")
      ) {
        this.log(LINTINGS.PARAM_DESCRIPTION_WITH_MISCASED_ID)(node);
      }

      if (
        ts.isNoSubstitutionTemplateLiteral(node.getChildAt(2)) &&
        !node.getChildAt(2).getText().includes("'") &&
        !node.getChildAt(2).getText().includes('"')
      ) {
        this.log(LINTINGS.PARAM_DESCRIPTION_WITH_UNNEEDED_BACKTICKS)(node);
      }

      const descriptionValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (descriptionValue === "") {
        this.log(LINTINGS.PARAM_DESCRIPTION_AS_EMPTY_STRING)(node);
      }

      if (descriptionValue && !startsWithCapital(descriptionValue)) {
        this.log(LINTINGS.PARAM_DESCRIPTION_WITH_UNCAPITALIZED_INITIAL)(node);
      }

      this.checkFinalPeriod(descriptionValue, node);

      if (
        hasAnchorLink(descriptionValue) &&
        !hasTargetBlank(descriptionValue)
      ) {
        this.log(LINTINGS.ANCHOR_LINK_WITH_TARGET_BLANK_MISSING)(node);
      }
    }

    if (
      node.getChildAt(0).getText() === "name" &&
      node.getChildAt(2).getText() !== "'additionalFields'"
    ) {
      let hasDescription = false;
      let hasResourceParent = false; // skip check for resource options
      let isBooleanType = false;

      node.parent.forEachChild((node) => {
        if (node.getText() === "type: 'boolean'") {
          isBooleanType = true;
        }

        node.parent.parent.parent.parent.forEachChild((child) => {
          if (child.getText() === "name: 'resource'") {
            hasResourceParent = true;
          }
        });

        if (
          ts.isPropertyAssignment(node) &&
          node.getChildAt(0).getText() === "description"
        ) {
          hasDescription = true;

          if (
            isBooleanType &&
            !node.getChildAt(2).getText().startsWith("'Whether")
          ) {
            this.log(LINTINGS.BOOLEAN_DESCRIPTION_NOT_STARTING_WITH_WHETHER)(
              node
            );
          }
        }
      });

      if (
        !hasDescription &&
        (hasResourceParent || hasCredentialsParent || hasDefaultsParent)
      ) {
        this.log(LINTINGS.PARAM_DESCRIPTION_MISSING_WHERE_OPTIONAL)(node);
      }

      if (
        !hasDescription &&
        !hasResourceParent &&
        !hasCredentialsParent &&
        !hasDefaultsParent &&
        !isNameInArrowFunction &&
        !isNameWithVariableDeclarationParent
      ) {
        let isFixedCollection = false;
        node.parent.parent.parent.parent.forEachChild((child) => {
          // skip required param description for middle container of fixed collection
          if (
            child?.getChildAt(0)?.getText() === "type" &&
            child?.getChildAt(2)?.getText() === "'fixedCollection'"
          ) {
            isFixedCollection = true;
          }
        });

        !isFixedCollection &&
          this.log(LINTINGS.PARAM_DESCRIPTION_MISSING_WHERE_REQUIRED)(node);
      }
    }

    return this.logs;
  }
}
