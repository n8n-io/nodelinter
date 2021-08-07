import { defaultConfig } from "../defaultConfig";
import { Validator } from "../services";
import { ConfigManager } from "../services/ConfigManager";
import {
  validatorMockFilePath,
  runTest,
  transpile,
} from "./helpers/testHelpers";
import { lintingsByGroup } from "./helpers/testHelpers";

describe("Validator should validate name values", () => {
  const lintArea = "name";

  if (ConfigManager.lintAreaIsDisabled(lintArea, defaultConfig)) return;

  const sourceFilePath = validatorMockFilePath(`${lintArea}.ts`);
  const validator = new Validator(sourceFilePath);

  transpile(validator, sourceFilePath);

  lintingsByGroup[lintArea].forEach(runTest(validator));
});
