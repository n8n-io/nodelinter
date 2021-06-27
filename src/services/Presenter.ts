import chalk from "chalk";
import { config } from "../config";

export class Presenter {
  static lineWrapChars = 60;
  static targetHasFullPath = false;

  static logs: Log[];
  static log: Log;
  static isLastLog: boolean;

  static errorBaseColor = config.logLevelColors.error
    ? chalk.hex(config.logLevelColors.error)
    : chalk.redBright;

  static warningBaseColor = config.logLevelColors.warning
    ? chalk.hex(config.logLevelColors.warning)
    : chalk.yellowBright;

  static infoBaseColor = config.logLevelColors.info
    ? chalk.hex(config.logLevelColors.info)
    : chalk.blueBright;

  public static showLogs(
    logs: Log[],
    { targetHasFullPath } = { targetHasFullPath: false }
  ) {
    this.targetHasFullPath = targetHasFullPath;
    this.showHeader(logs);

    logs = this.sortLogs(logs);

    logs.forEach((log, index) => {
      this.logs = logs;
      this.log = log;
      this.isLastLog = index === this.logs.length - 1;

      this.showMainLine();

      if (config.showDetails) {
        log.details && this.showDetailsLine();
      }

      this.showExcerptLine();
      this.showFinalLine();
    });
  }

  // ----------------------------------
  //             header
  // ----------------------------------

  private static showHeader(logs: Log[]) {
    const filePath = this.targetHasFullPath
      ? logs[0].sourceFilePath.split("/").slice(-3).join("/")
      : logs[0].sourceFilePath;

    const parts = filePath.split("/");
    const [fileName, ...basePath] = [parts.pop(), ...parts];

    console.log(
      ` ` +
        chalk.inverse(` • `) +
        ` ` +
        chalk.grey(basePath.join("/")) +
        ` » ` +
        chalk.bold.inverse(` ${fileName} `)
    );

    console.log(chalk.grey("  │"));
  }

  // ----------------------------------
  //            main line
  // ----------------------------------

  private static showMainLine() {
    const connector = this.isLastLog ? "└──" : "├──";
    const indentation = " ".repeat(2);

    console.log(
      indentation +
        chalk.grey(connector) +
        this.formatLineNumber(this.log.line) +
        this.colorLogAndMessage(this.log.logLevel, this.log.message)
    );
  }

  private static formatLineNumber(line: number) {
    const zeroPadded = line.toString().padStart(3, "0");
    const whitespacePadded = this.pad(zeroPadded, 5, " ");
    return chalk.white.inverse(whitespacePadded);
  }

  private static pad(text: string, length = 11, padChar: string) {
    return text
      .padStart((text.length + length) / 2, padChar)
      .padEnd(length, padChar);
  }

  private static colorLogAndMessage(logLevel: LogLevel, message: string) {
    const color = this.getColor(logLevel);
    const indentation = " ".repeat(1);

    return indentation + color(`${logLevel.toUpperCase()}: ${message}`);
  }

  // ----------------------------------
  //           details line
  // ----------------------------------

  private static showDetailsLine() {
    if (!this.log.details) throw new Error("Something went wrong"); // TODO: Rewrite as assert

    const connector = this.isLastLog ? " " : "│";
    const connectorIndentation = " ".repeat(2);
    const detailsIndentation = " ".repeat(8);

    const showDetailsLine = (detailsLine: string) =>
      console.log(
        connectorIndentation +
          chalk.grey(connector) +
          detailsIndentation +
          chalk.white(detailsLine)
      );

    if (this.log.details.length > this.lineWrapChars) {
      const detailsParts = this.splitDetails(this.log.details);
      detailsParts.forEach(showDetailsLine);
    } else {
      showDetailsLine(this.log.details);
    }
  }

  private static splitDetails(
    details: string,
    result: string[] = []
  ): string[] {
    if (details.length === 0) return result;

    result.push(details.substring(0, this.lineWrapChars));
    return this.splitDetails(details.substring(this.lineWrapChars), result);
  }

  // ----------------------------------
  //           excerpt line
  // ----------------------------------

  private static showExcerptLine() {
    const connector = this.isLastLog ? " " : "│";
    const connectorIndentation = " ".repeat(2);
    const excerptIndentation = " ".repeat(8);

    console.log(
      chalk.grey(
        connectorIndentation + connector + excerptIndentation + this.log.excerpt
      )
    );
  }

  // ----------------------------------
  //           final line
  // ----------------------------------

  private static showFinalLine() {
    const connector = this.isLastLog ? " " : "│";
    const indentation = " ".repeat(2);
    console.log(chalk.grey(indentation + connector));
  }

  // ----------------------------------
  //           summary
  // ----------------------------------

  public static summarize(allFilesLogs: Log[], executionTimeMs: number) {
    let errors = 0;
    let warnings = 0;
    let infos = 0;

    allFilesLogs.forEach((log) => {
      if (log.logLevel === "error") errors++;
      if (log.logLevel === "warning") warnings++;
      if (log.logLevel === "info") infos++;
    });

    this.showSummary({
      errors,
      warnings,
      infos,
      total: allFilesLogs.length,
      executionTimeMs,
    });
  }

  public static showSummary({
    total,
    errors,
    warnings,
    infos,
    executionTimeMs,
  }: LogSummary) {
    const indentation = " ".repeat(2);

    console.log(chalk.white.bold(`Total\t\t${total}`));

    console.log(this.getColor("error")(indentation + `Errors\t${errors}`));
    console.log(
      this.getColor("warning")(indentation + `Warnings\t${warnings}`)
    );
    console.log(this.getColor("info")(indentation + `Infos\t\t${infos}`));
    console.log(`Time\t\t${executionTimeMs} ms`);
  }

  // ----------------------------------
  //              utils
  // ----------------------------------

  private static getColor(logLevel: LogLevel, { thin } = { thin: false }) {
    return {
      error: thin ? this.errorBaseColor : this.errorBaseColor.bold,
      warning: thin ? this.warningBaseColor : this.warningBaseColor.bold,
      info: thin ? this.infoBaseColor : this.infoBaseColor.bold,
    }[logLevel];
  }

  private static sortLogs(logs: Log[]) {
    if (config.sortLogs === "importance") return this.sortByImportance(logs);
    if (config.sortLogs === "lineNumber") return this.sortByLineNumber(logs);

    throw new Error("Logs may only be sorted by importance or line number.");
  }

  private static sortByImportance(logs: Log[]) {
    const errors: Log[] = [];
    const warnings: Log[] = [];
    const infos: Log[] = [];

    logs.forEach((log) => {
      if (log.logLevel === "error") errors.push(log);
      if (log.logLevel === "warning") warnings.push(log);
      if (log.logLevel === "info") infos.push(log);
    });

    return [...errors, ...warnings, ...infos];
  }

  private static sortByLineNumber(logs: Log[]) {
    return logs.sort((a, b) => a.line - b.line);
  }
}
