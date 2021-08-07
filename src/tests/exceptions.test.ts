import path from "path";
import { LINTINGS } from "../lintings";
import { Validator } from "../services";
import { exceptionMockFilePath, transpile } from "./helpers/testHelpers";

describe("Exceptions should disable lintings", () => {
  it("Single-linting exception for next line", () => {
    // PARAM_DESCRIPTION_UNTRIMMED
    const sourceFilePath = exceptionMockFilePath("single.ts");
    const validator = new Validator(sourceFilePath);

    transpile(validator, sourceFilePath);

    const found = validator.logs.find(
      (log) => log.message === LINTINGS.PARAM_DESCRIPTION_UNTRIMMED.message
    );

    expect(found).toBeUndefined();
  });

  it("Multiple-lintings exception for next line", () => {
    // PARAM_DESCRIPTION_UNTRIMMED
    // PARAM_DESCRIPTION_WITH_EXCESS_WHITESPACE

    const sourceFilePath = exceptionMockFilePath("multiple.ts");
    const validator = new Validator(sourceFilePath);

    transpile(validator, sourceFilePath);

    const foundUntrimmed = validator.logs.find(
      (log) => log.message === LINTINGS.PARAM_DESCRIPTION_UNTRIMMED.message
    );

    const foundExcess = validator.logs.find(
      (log) =>
        log.message ===
        LINTINGS.PARAM_DESCRIPTION_WITH_EXCESS_WHITESPACE.message
    );

    expect(foundUntrimmed).toBeUndefined();
    expect(foundExcess).toBeUndefined();
  });

  it("All-lintings exception for next line", () => {
    const sourceFilePath = exceptionMockFilePath("all.ts");
    const validator = new Validator(sourceFilePath);

    transpile(validator, sourceFilePath);

    expect(validator.logs.length).toBe(0);
  });
});
