import chalk from "chalk";
import minimist from "minimist";
import {
  DEFAULT_AUTODETECT_FILENAME,
  DEFAULT_PRINT_FILENAME,
  ERRORS,
  LINTABLE_FILE_PATTERNS,
} from "../constants";
import { collect, getLinting, getLintingName, terminate } from "../utils";
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

  /**
   * `isNotTestRun` is needed so that tests use `defaultConfig` instead of `customConfig`.
   */
  constructor(args: string[]) {
    this.parseArgs(args);

    if (!this.configPath && isNotTestRun) this.autoDetectConfigPath();
    if (this.configPath) this.loadCustomConfig();

    isNotTestRun && this.validateTargetKeyExists();

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
    const cliArgs = minimist<CliArgs>(args);

    this.parseOnlyArgs({
      "error-only": cliArgs["error-only"],
      "warning-only": cliArgs["warning-only"],
      "info-only": cliArgs["info-only"],
    });

    this.parsePrintArgs(cliArgs.print);
    this.parsePatternsArgs(cliArgs.patterns);

    if (cliArgs.config) this.configPath = cliArgs.config;
    if (cliArgs.target) this.targetPath = cliArgs.target;
  }

  private parseOnlyArgs(multiWordArgs: MultiWordArgs) {
    const quantity = Object.values(multiWordArgs).filter(Boolean).length;

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

    const parsedPatterns = patterns.split(",").map((p) => p.trim());

    this.adjustPattern(parsedPatterns, { from: "node.ts", to: ".node.ts" });
    this.adjustPattern(parsedPatterns, {
      from: ".Description.ts",
      to: "Description.ts",
    });

    if (!this.areValidPatterns(parsedPatterns))
      terminate(ERRORS.INVALID_PATTERNS);

    this.patterns = parsedPatterns;
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

  private areValidPatterns(value: unknown): value is LintableFilePattern[] {
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

  // ----------------------------------
  //         state reporting
  // ----------------------------------

  // TODO: Refactor to remove repetition

  static lintAreaIsDisabled(lintArea: LintArea, config: Config) {
    return !config.enable.lintAreas[lintArea];
  }

  static lintIssueIsDisabled(lintIssue: LintIssue, config: Config) {
    return !config.enable.lintIssues[lintIssue];
  }

  static logLevelIsDisabled(logLevel: LogLevel, config: Config) {
    return !config.enable.logLevels[logLevel];
  }

  static lintingIsDisabled(linting: Linting, config: Config) {
    const configLinting = getLinting(linting, config.lintings);

    if (!configLinting) {
      throw new Error(`No config linting found for: ${linting.message}`);
    }

    return !configLinting.enabled;
  }

  /**
   * Report whether a linting at a line is disabled by an exception comment.
   */
  static lintingIsExcepted(
    linting: Linting,
    lintingLine: number,
    exceptions: Exception[],
    masterConfig: Config
  ) {
    const found = exceptions.find(({ lintingsToExcept, line }) => {
      const lintingName = getLintingName(linting, masterConfig);
      const lintingsMatch =
        lintingsToExcept.includes(lintingName) ||
        lintingsToExcept.includes("*");

      return lintingsMatch && line + 1 === lintingLine;
    });

    return found !== undefined;
  }
}
