#!/usr/bin/env node

import fs from "fs";
import minimist from "minimist";
import { defaultConfig } from "./defaultConfig";
import { lintAll } from "./scripts/lintAll";
import { lintOne } from "./scripts/lintOne";
import {
  collect,
  deepMerge,
  areValidPatterns,
  showError,
  fixPattern,
} from "./utils";
import chalk from "chalk";
import { DEFAULT_PRINT_FILENAME, ERRORS } from "./constants";

const isNotTestRun = process.argv[1].split("/").pop() !== "jest";

let { target, config, print, patterns, ...multiWordArgs } = minimist<CliArgs>(
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

const shouldPrint = print !== undefined;

const printFileName =
  typeof print === "string" && print !== "" ? print : DEFAULT_PRINT_FILENAME;

if (patterns && typeof patterns === "string") {
  patterns = patterns.split(",").map((p) => p.trim());

  // tolerate mistyped periods
  fixPattern(patterns, { from: "node.ts", to: ".node.ts" });
  fixPattern(patterns, { from: ".Description.ts", to: "Description.ts" });

  if (!areValidPatterns(patterns)) {
    showError(ERRORS.INVALID_PATTERN);
    process.exit(1);
  }
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

// --*-only flag overrides master config log levels
if (Object.keys(only).length === 1) {
  const key = Object.keys(only)[0];
  masterConfig.enable.logLevels = {
    error: false,
    warning: false,
    info: false,
  };
  masterConfig.enable.logLevels[key] = true;
}

// --patterns overrides master config patterns
if (patterns && areValidPatterns(patterns)) {
  masterConfig.patterns = patterns;
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
    ? lintAll(masterConfig, { shouldPrint, printFileName })
    : lintOne(masterConfig, { shouldPrint, printFileName });
}
