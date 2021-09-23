import ts from "typescript";
import { isCamelCase } from "../../utils";
import { LINTINGS } from "../../lintings";
import { Navigator } from "../Navigator";

export class NameValidator implements SubValidator {
  static lintArea = "name" as const;
  logs: Log[];
  log: LogFunction;

  public run(node: ts.Node) {
    if (Navigator.isAssignment(node, { key: "name", value: "*" })) {
      this.log(LINTINGS.NAME_USING_STAR_INSTEAD_OF_ALL)(node);
    }

    if (Navigator.isAssignment(node, { key: "name" })) {
      const hasDefaultsParent = node?.parent?.parent
        ?.getText()
        .startsWith("defaults"); // skip check for defaults

      if (hasDefaultsParent) return;

      const hasCredentialsParent = node?.parent?.parent?.parent
        ?.getText()
        .startsWith("credentials");

      const nameValue = node.getChildAt(2).getText().replace(/'/g, ""); // remove single quotes

      if (hasCredentialsParent) {
        if (!nameValue.endsWith("Api")) {
          this.log(LINTINGS.NON_SUFFIXED_CREDENTIALS_NAME)(node);
        }
      }

      if (nameValue === "authentication") {
        this.log(LINTINGS.AUTHENTICATION_PARAM_NOT_IN_CREDENTIALS)(node);
      }

      let isOption = false;
      node.parent.forEachChild((node) => {
        if (Navigator.isAssignment(node, { key: "value" })) {
          isOption = true;
        }
      });

      if (!isOption) {
        if (
          (nameValue.length > 2 &&
            !nameValue.includes("_") &&
            nameValue.match(/id$/)) ||
          nameValue.match(/ID$/)
        ) {
          this.log(LINTINGS.NAME_WITH_MISCASED_ID)(node);
        }

        if (!isCamelCase(nameValue)) {
          this.log(LINTINGS.NAME_WITH_NO_CAMELCASE)(node);
        }
      }
    }

    return this.logs;
  }
}
