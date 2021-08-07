import path from "path";
import { defaultConfig } from "../defaultConfig";
import { Traverser, Validator } from "../services";
import { lintAreaIsDisabled } from "../utils";
import {
  validatorMockFilePath,
  runTest,
  separateContinueOnFail,
  transpile,
} from "./helpers/testHelpers";
import { lintingsByGroup } from "./helpers/testHelpers";

describe("Validator should validate miscellaneous rules", () => {
  const lintArea = "miscellaneous";

  if (lintAreaIsDisabled(lintArea, defaultConfig)) return;

  const sourceFilePath = validatorMockFilePath(`${lintArea}.ts`);
  const sourceFilePathNodeTs = validatorMockFilePath("miscellaneous.node.ts");

  const validator = new Validator(sourceFilePath);
  const validatorNodeTs = new Validator(sourceFilePathNodeTs);

  transpile(validator, sourceFilePath);
  Traverser.sourceFilePath = sourceFilePathNodeTs; // required for Validator.runFinal()
  transpile(validatorNodeTs, sourceFilePathNodeTs);

  const [continueOnFail, others] = separateContinueOnFail(
    lintingsByGroup[lintArea]
  );

  runTest(validatorNodeTs)(continueOnFail);
  others.forEach(runTest(validator));
});
