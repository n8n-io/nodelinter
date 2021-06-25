import ts from "typescript";
import { Logger } from "../services";
import * as subValidators from "./subValidators";
import { config } from "../config";

export class Validator {
  public logs: Log[] = [];
  private node: ts.Node;

  constructor(public sourceFilePath: string) {}

  public setNode(node: ts.Node) {
    this.node = node;
    return this;
  }

  public run() {
    Object.values(subValidators).forEach((subValidator) => {
      this.runSubValidator(subValidator);
    });
  }

  private runSubValidator(constructor: SubValidatorConstructor) {
    const SubValidator = Logger(constructor, this.sourceFilePath);
    const logs = new SubValidator().run(this.node);

    if (logs?.length) this.logs.push(...logs);
  }
}
