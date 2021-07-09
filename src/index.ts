#!/usr/bin/env node

import fs from "fs";
import minimist from "minimist";
import { defaultConfig } from "./defaultConfig";
import { lintAll } from "./scripts/lintAll";
import { lintOne } from "./scripts/lintOne";
import { ERRORS, showError } from "./errors";
import { deepMerge } from "./utils";

const { target, t, config, c } = minimist(process.argv.slice(2));

let masterConfig = defaultConfig;

if (c || config) {
  let customConfig;

  try {
    customConfig = require(c || config);
  } catch (error) {
    showError(ERRORS.FAILED_TO_IMPORT_CONFIG_FILE);
    process.exit(1);
  }

  if (!customConfig.target && !t && !target) {
    showError(ERRORS.UNSPECIFIED_TARGET);
    process.exit(1);
  }

  if (customConfig.target && (t || target)) {
    showError(ERRORS.OVERSPECIFIED_TARGET);
    process.exit(1);
  }

  // TODO: Validate nested keys in custom config
  for (const key in customConfig) {
    if (!Object.keys(defaultConfig).includes(key)) {
      showError(`${ERRORS.INVALID_CUSTOM_CONFIG} ${key}`);
      console.log(customConfig);
      process.exit(1);
    }
  }

  masterConfig = deepMerge(defaultConfig, customConfig);
}

export { masterConfig };

if (process.argv[1].split("/").pop() !== "jest") {
  fs.lstatSync(t || target || masterConfig.target).isDirectory()
    ? lintAll(masterConfig)
    : lintOne(masterConfig);
}
