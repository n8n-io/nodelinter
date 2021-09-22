import { defaultConfig } from "../defaultConfig";
import { Traverser, Validator } from "../services";
import { ConfigManager } from "../services/ConfigManager";
import {
  validatorMockFilePath,
  runTest,
  transpile,
  separateCheckCredTestFunctions
} from "./helpers/testHelpers";
import { lintingsByGroup } from "./helpers/testHelpers";

describe("Validator should validate node description", () => {
  const lintArea = "nodeDescription";

  if (ConfigManager.lintAreaIsDisabled(lintArea, defaultConfig)) return;

  const sourceFilePath = validatorMockFilePath(`${lintArea}.ts`);
  const sourceFilePathNodeTs = validatorMockFilePath("nodeDescription.node.ts");
  const validator = new Validator(sourceFilePath);
  const validatorNodeTs = new Validator(sourceFilePathNodeTs);

  transpile(validator, sourceFilePath);
  Traverser.sourceFilePath = sourceFilePathNodeTs; // required for Validator.runFinal()
  transpile(validatorNodeTs, sourceFilePathNodeTs);

  const [checkCredTestFunctions, others] = separateCheckCredTestFunctions(
    lintingsByGroup[lintArea]
  );

  runTest(validatorNodeTs)(checkCredTestFunctions);
  others.forEach(runTest(validator));
});
