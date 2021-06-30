import path from "path";
import { Validator } from "../services";
import { lintAreaIsDisabled } from "../utils";
import {
  buildSourceFilePath,
  runTest,
  separateContinueOnFail,
  transpile,
} from "./testHelpers";
import { lintingsByGroup } from "./testHelpers";

describe("Validator should validate miscellaneous rules", () => {
  const lintArea = "miscellaneous";

  if (lintAreaIsDisabled(lintArea)) return;

  const sourceFilePath = buildSourceFilePath(lintArea);
  const sourceFilePathNodeTs = path.join(
    "src",
    "tests",
    "input",
    "miscellaneous.node.ts"
  );
  const validator = new Validator(sourceFilePath);
  const validatorNodeTs = new Validator(sourceFilePathNodeTs);

  transpile(validator, sourceFilePath);
  transpile(validatorNodeTs, sourceFilePathNodeTs);

  const [continueOnFail, others] = separateContinueOnFail(
    lintingsByGroup[lintArea]
  );

  runTest(validatorNodeTs)(continueOnFail);
  others.forEach(runTest(validator));
});
