import chalk from "chalk";
import minimist from "minimist";
import {
  DEFAULT_AUTODETECT_FILENAME,
  DEFAULT_PRINT_FILENAME,
  ERRORS,
  LINTABLE_FILE_PATTERNS,
} from "../constants";
import { collect, terminate } from "../utils";
import { defaultConfig } from "../defaultConfig";
import { isNotTestRun } from "..";

export class ConfigManager {
  printLogs: boolean;
  printFileName: string;
  only: LogLevel;
  patterns: LintableFilePattern[];

  configPath: string;
  targetPath: string;

  defaultConfig = defaultConfig;
  customConfig: Config;
  masterConfig: Config;

  constructor(args: string[]) {
    this.parseArgs(args);

    // `isNotTestRun` is needed so that tests use `defaultConfig`
    if (!this.configPath && isNotTestRun) this.autoDetectConfigPath();
    if (this.configPath) this.loadCustomConfig();

    this.validateTargetKeyExists();

    if (this.customConfig) {
      this.validateNoUnknownKeys();
      this.validateNoTargetKeyConflict();
      this.masterConfig = this.deepMerge(this.defaultConfig, this.customConfig);
      if (this.targetPath) this.masterConfig.target = this.targetPath;
    } else {
      this.masterConfig = { ...this.defaultConfig, target: this.targetPath };
    }

    // overrides
    if (this.only) this.overrideLogLevels();
    if (this.patterns) this.masterConfig.patterns = this.patterns;
  }

  // ----------------------------------
  //          CLI arg parsers
  // ----------------------------------

  private parseArgs(args: string[]) {
    const { target, config, patterns, print, ...multiWordArgs } =
      minimist<CliArgs>(args);

    this.parseMultiWordArgs(multiWordArgs);
    this.parsePrintArgs(print);
    this.parsePatternsArgs(patterns);

    if (config) this.configPath = config;
    if (target) this.targetPath = target;
  }

  private parseMultiWordArgs(multiWordArgs: MultiWordArgs) {
    const quantity = Object.keys(multiWordArgs).length;

    if (quantity === 0) return;

    if (quantity > 1) terminate(ERRORS.MULTIPLE_ONLY_ARGS);

    if (quantity === 1) {
      if (multiWordArgs["error-only"]) this.only = "error";
      else if (multiWordArgs["warning-only"]) this.only = "warning";
      else if (multiWordArgs["info-only"]) this.only = "info";
    }
  }

  private parsePrintArgs(print?: string | boolean) {
    if (!print) return;

    this.printLogs = true;

    this.printFileName =
      typeof print === "string" && print !== ""
        ? print
        : DEFAULT_PRINT_FILENAME;
  }

  private parsePatternsArgs(patterns?: string) {
    if (!patterns) return;

    const parsed = patterns.split(",").map((p) => p.trim());

    this.adjustPattern(parsed, { from: "node.ts", to: ".node.ts" });
    this.adjustPattern(parsed, {
      from: ".Description.ts",
      to: "Description.ts",
    });

    if (!this.areValid(parsed)) terminate(ERRORS.INVALID_PATTERNS);

    this.patterns = parsed;
  }

  overrideLogLevels() {
    this.masterConfig.enable.logLevels = {
      error: false,
      warning: false,
      info: false,
    };

    this.masterConfig.enable.logLevels[this.only] = true;
  }

  /**
   * Adjust lintable file patterns to tolerate mistypings.
   */
  private adjustPattern(patterns: string[], { from, to }: AdjustPatternArg) {
    const mistypedPatternIndex = patterns.findIndex((p) => p === from);

    if (mistypedPatternIndex !== -1) {
      patterns[mistypedPatternIndex] = to;
    }

    return patterns;
  }

  private areValid(value: any): value is LintableFilePattern[] {
    return (
      Array.isArray(value) &&
      value.every((item) => LINTABLE_FILE_PATTERNS.includes(item))
    );
  }

  // ----------------------------------
  //          arg loaders
  // ----------------------------------

  private loadCustomConfig() {
    try {
      this.customConfig = require(this.configPath);
    } catch (error) {
      terminate(ERRORS.FAILED_TO_IMPORT_CUSTOM_CONFIG);
    }
  }

  private autoDetectConfigPath() {
    console.log(
      chalk.dim("No --config option specified, attempting to autodetect...\n")
    );

    const autodetected = collect(
      process.cwd(),
      (f) => f === DEFAULT_AUTODETECT_FILENAME
    ).pop();

    if (autodetected) {
      console.log(chalk.bold(`Custom config autodetected:\n${autodetected}\n`));
      this.configPath = autodetected;
    }
  }

  /**
   * Validate that the custom config only contains keys
   * found in the default config.
   */
  private validateNoUnknownKeys() {
    // TODO: Validate nested keys in custom config
    for (const key in this.customConfig) {
      // @ts-ignore TODO
      if (!Object.keys(this.defaultConfig).includes(key)) {
        terminate(`${ERRORS.UNKNOWN_KEY_IN_CUSTOM_CONFIG} ${key}`);
      }
    }
  }

  private validateTargetKeyExists() {
    if (!this.targetPath && !this.customConfig?.target) {
      terminate(ERRORS.UNSPECIFIED_TARGET);
    }
  }

  /**
   * Validate that a single target exists, either
   * - the `--target` CLI arg, i.e. `this.targetPath` or
   * - the `target` key in the custom config, i.e. `this.customConfig.target`.
   */
  private validateNoTargetKeyConflict() {
    if (this.customConfig.target && this.targetPath) {
      terminate(ERRORS.OVERSPECIFIED_TARGET);
    }
  }

  // TODO: Type properly
  private deepMerge(...objects: any) {
    let result: any = {};

    for (const o of objects) {
      for (let [key, value] of Object.entries(o)) {
        if (value instanceof Array) {
          result = { ...result, [key]: value };
          continue;
        }

        if (value instanceof Object && key in result) {
          value = this.deepMerge(result[key], value);
        }

        result = { ...result, [key]: value };
      }
    }

    return result;
  }
}
