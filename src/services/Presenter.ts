import chalk from "chalk";

export class Presenter {
  lineWrapChars = 60;
  absolutePathTarget = false;

  logs: Log[];
  log: Log;
  isLastLog: boolean;

  config: Config;

  errorBaseColor: chalk.Chalk;
  warningBaseColor: chalk.Chalk;
  infoBaseColor: chalk.Chalk;

  constructor(config: Config) {
    this.config = config;

    this.absolutePathTarget = config.target[0] !== ".";

    this.errorBaseColor = this.config.logLevelColors.error
      ? chalk.hex(this.config.logLevelColors.error)
      : chalk.redBright;

    this.warningBaseColor = this.config.logLevelColors.warning
      ? chalk.hex(this.config.logLevelColors.warning)
      : chalk.yellowBright;

    this.infoBaseColor = this.config.logLevelColors.info
      ? chalk.hex(this.config.logLevelColors.info)
      : chalk.blueBright;
  }

  public showLogs(logs: Log[]) {
    this.showHeader(logs);

    logs = this.sortLogs(logs);

    logs.forEach((log, index) => {
      this.logs = logs;
      this.log = log;
      this.isLastLog = index === this.logs.length - 1;

      this.showMainLine();

      if (this.config.showDetails) {
        log.details && this.showDetailsLine();
      }

      this.showExcerptLine();
      this.showFinalLine();
    });
  }

  // ----------------------------------
  //             header
  // ----------------------------------

  private showHeader(logs: Log[]) {
    if (!logs[0]) return; // file with no lint logs

    const filePath = this.absolutePathTarget
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

  private showMainLine() {
    const connector = this.isLastLog ? "└──" : "├──";
    const indentation = " ".repeat(2);

    console.log(
      indentation +
        chalk.grey(connector) +
        this.formatLineNumber(this.log.line) +
        this.colorLogAndMessage(this.log.logLevel, this.log.message)
    );
  }

  private formatLineNumber(line: number) {
    const zeroPadded = line.toString().padStart(3, "0");
    const whitespacePadded = this.pad(zeroPadded, 5, " ");
    return chalk.white.inverse(whitespacePadded);
  }

  private pad(text: string, length = 11, padChar: string) {
    return text
      .padStart((text.length + length) / 2, padChar)
      .padEnd(length, padChar);
  }

  private colorLogAndMessage(logLevel: LogLevel, message: string) {
    const color = this.getColor(logLevel);
    const indentation = " ".repeat(1);

    return indentation + color(`${logLevel.toUpperCase()}: ${message}`);
  }

  // ----------------------------------
  //           details line
  // ----------------------------------

  private showDetailsLine() {
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

  private splitDetails(details: string, result: string[] = []): string[] {
    if (details.length === 0) return result;

    result.push(details.substring(0, this.lineWrapChars));
    return this.splitDetails(details.substring(this.lineWrapChars), result);
  }

  // ----------------------------------
  //           excerpt line
  // ----------------------------------

  private showExcerptLine() {
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

  private showFinalLine() {
    const connector = this.isLastLog ? " " : "│";
    const indentation = " ".repeat(2);
    console.log(chalk.grey(indentation + connector));
  }

  // ----------------------------------
  //           summary
  // ----------------------------------

  public summarize(allFilesLogs: Log[], executionTimeMs: number) {
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

  public showSummary({
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

  private getColor(logLevel: LogLevel, { thin } = { thin: false }) {
    return {
      error: thin ? this.errorBaseColor : this.errorBaseColor.bold,
      warning: thin ? this.warningBaseColor : this.warningBaseColor.bold,
      info: thin ? this.infoBaseColor : this.infoBaseColor.bold,
    }[logLevel];
  }

  private sortLogs(logs: Log[]) {
    if (this.config.sortLogs === "importance")
      return this.sortByImportance(logs);
    if (this.config.sortLogs === "lineNumber")
      return this.sortByLineNumber(logs);

    throw new Error("Logs may only be sorted by importance or line number.");
  }

  private sortByImportance(logs: Log[]) {
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

  private sortByLineNumber(logs: Log[]) {
    return logs.sort((a, b) => a.line - b.line);
  }
}
