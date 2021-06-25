import { Validator } from "../services";
import { lintAreaIsDisabled } from "../utils";
import { buildSourceFilePath, runTest, transpile } from "./testHelpers";
import { lintingsByGroup } from "./testHelpers";

describe("Validator should validate default values", () => {
  const lintArea = "default";

  if (lintAreaIsDisabled(lintArea)) return;

  const sourceFilePath = buildSourceFilePath(lintArea);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  lintingsByGroup[lintArea].forEach(runTest(validator));
});
