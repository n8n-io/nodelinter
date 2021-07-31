#!/usr/bin/env node

import fs from "fs";
import minimist from "minimist";
import { defaultConfig } from "./defaultConfig";
import { lintAll } from "./scripts/lintAll";
import { lintOne } from "./scripts/lintOne";
import { collect, deepMerge, showError } from "./utils";
import chalk from "chalk";
import { ERRORS } from "./constants";

const isNotTestRun = process.argv[1].split("/").pop() !== "jest";

let { target, config, print, ...multiWordArgs } = minimist<CliArgs>(
  process.argv.slice(2)
);

const only: { [key in LogLevel]: boolean } = {
  error: multiWordArgs["error-only"] ?? false,
  warning: multiWordArgs["warning-only"] ?? false,
  info: multiWordArgs["info-only"] ?? false,
};

Object.keys(only).forEach((key) => {
  if (!only[key]) delete only[key];
});

if (Object.keys(only).length > 1) {
  showError(ERRORS.MULTIPLE_ONLY_ARGS);
  process.exit(1);
}

let masterConfig = defaultConfig;

if (isNotTestRun && !target && !config) {
  console.log(
    chalk.bold("No --path or --config option specified, autodetecting...")
  );

  const autoDetectedConfig = collect(
    process.cwd(),
    (f) => f === "nodelinter.config.json"
  ).pop();

  if (!autoDetectedConfig) {
    showError(ERRORS.CONFIG_AUTODETECTION_FAILED);
    showError(ERRORS.UNSPECIFIED_TARGET);
    process.exit(1);
  }

  console.log(chalk.bold(`Config located: ${autoDetectedConfig}\n`));

  config = autoDetectedConfig;
}

if (!config && target) {
  masterConfig.target = target;
}

if (config) {
  let customConfig;

  try {
    customConfig = require(config) as Config;
  } catch (error) {
    showError(ERRORS.FAILED_TO_IMPORT_CONFIG_FILE);
    process.exit(1);
  }

  if (!customConfig.target && !target) {
    showError(ERRORS.UNSPECIFIED_TARGET);
    process.exit(1);
  }

  if (customConfig.target && target) {
    showError(ERRORS.OVERSPECIFIED_TARGET);
    process.exit(1);
  }

  // TODO: Validate nested keys in custom config
  for (const key in customConfig) {
    // @ts-ignore TODO
    if (!Object.keys(defaultConfig).includes(key)) {
      showError(`${ERRORS.UNKNOWN_KEY_IN_CUSTOM_CONFIG} ${key}`);
      console.log(customConfig);
      process.exit(1);
    }
  }

  masterConfig = deepMerge(defaultConfig, customConfig);
}

// if --*-only flag, override master log levels
if (Object.keys(only).length === 1) {
  const key = Object.keys(only)[0];
  masterConfig.enable.logLevels = {
    error: false,
    warning: false,
    info: false,
  };
  masterConfig.enable.logLevels[key] = true;
}

export { masterConfig };

if (isNotTestRun) {
  let symlink;

  try {
    symlink = fs.lstatSync(masterConfig.target);
  } catch (error) {
    showError(`${ERRORS.FAILED_TO_FIND_TARGET}: ${error.path}`);
    process.exit(1);
  }

  symlink.isDirectory()
    ? lintAll(masterConfig, { print })
    : lintOne(masterConfig, { print });
}
