#!/usr/bin/env node

import fs from "fs";
import minimist from "minimist";
import { defaultConfig } from "./defaultConfig";
import { lintAll } from "./scripts/lintAll";
import { lintOne } from "./scripts/lintOne";
import { ERRORS, showError } from "./errors";
import { collect, deepMerge } from "./utils";
import chalk from "chalk";

const isNotTestRun = process.argv[1].split("/").pop() !== "jest";
let { target, t, config, c } = minimist(process.argv.slice(2));

let masterConfig = defaultConfig;

if (isNotTestRun && !target && !t && !config && !c) {
  console.log(chalk.bold("No --path or --config option specified"));
  console.log(chalk.bold("Attempting to locate config in working dir...\n"));

  const found = collect(
    process.cwd(),
    (f) => f === "nodelinter.config.json"
  ).pop();

  if (!found) {
    showError(ERRORS.UNSPECIFIED_TARGET_AND_NO_AUTODETECT);
    process.exit(1);
  }

  console.log(chalk.bold(`Config located: ${found}\n`));

  c = found;
}

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

if (isNotTestRun) {
  fs.lstatSync(t || target || masterConfig.target).isDirectory()
    ? lintAll(masterConfig)
    : lintOne(masterConfig);
}
