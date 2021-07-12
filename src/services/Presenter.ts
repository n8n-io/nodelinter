import chalk from "chalk";

export class Presenter {
  config: Config;
  targethasAbsolutePath = false;

  logs: Log[];
  log: Log;
  isLastLog: boolean;

  errorBaseColor: chalk.Chalk;
  warningBaseColor: chalk.Chalk;
  infoBaseColor: chalk.Chalk;

  constructor(config: Config) {
    this.config = config;

    this.targethasAbsolutePath = config.target[0] !== ".";

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

    logs = this.removeRedundantLogs(logs);
    this.logs = this.sortLogs(logs);

    logs.forEach((log, index) => {
      this.log = log;
      this.isLastLog = index === this.logs.length - 1;

      this.showMainLine();

      if (this.config.showDetails && log.details) this.showDetailsLine();

      this.showExcerptLine();
      this.showFinalLine();
    });
  }

  // ----------------------------------
  //             header
  // ----------------------------------

  private showHeader(logs: Log[]) {
    if (!logs[0]) return; // file with no lint logs

    const filePath = this.targethasAbsolutePath
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
    const indentationForFirst = " ".repeat(1);
    const indentationForConnector = " ".repeat(2);
    const indentationForRest = " ".repeat(8);

    const logAndMessage = `${logLevel.toUpperCase()}: ${message}`;

    if (message.length > this.config.lineWrapChars) {
      const result: string[] = [];

      const [first, ...rest] = this.wrapLines(logAndMessage);
      result.push(indentationForFirst + color(first));

      result.push(
        ...rest.map(
          (line) =>
            indentationForConnector +
            chalk.grey(this.isLastLog ? " " : "│") +
            indentationForRest +
            color(line)
        )
      );
      return result.join("\n");
    }

    return indentationForFirst + color(`${logLevel.toUpperCase()}: ${message}`);
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

    if (this.log.details.length > this.config.lineWrapChars) {
      const wrappedLines = this.wrapLines(this.log.details);
      wrappedLines.forEach(showDetailsLine);
    } else {
      showDetailsLine(this.log.details);
    }
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
    console.log(`Time\t\t${executionTimeMs} ms\n`);
  }

  // ----------------------------------
  //           line wrapping
  // ----------------------------------

  /**
   * Wrap text into n-chars-long lines, at whitespace chars.
   */
  private wrapLines(text: string, result: string[] = []): string[] {
    if (text.length === 0) return result;

    if (text.length < this.config.lineWrapChars || !text.includes(" ")) {
      result.push(text);
      return result;
    }

    const line = text.substring(0, this.config.lineWrapChars).split(" ");
    const remainder = line.pop(); // prevent wrapping mid-word
    result.push(line.join(" "));

    return this.wrapLines(
      (remainder + text).substring(this.config.lineWrapChars),
      result
    );
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
    if (this.config.sortMethod === "importance")
      return this.sortByImportance(logs);

    if (this.config.sortMethod === "lineNumber")
      return this.sortByLineNumber(logs);

    throw new Error("Logs may only be sorted by line number or by importance.");
  }

  /**
   * Separate logs based on whether they pass a test.
   */
  private separate<T>(items: T[], test: (log: T) => boolean): [T[], T[]] {
    const pass: T[] = [];
    const fail: T[] = [];

    items.forEach((item) => (test(item) ? pass : fail).push(item));

    return [pass, fail];
  }

  // ----------------------------------
  //         logs preprocessing
  // ----------------------------------

  /**
   * Remove logs that are logically covered by other logs on the same line.
   *
   * For example: `BOOLEAN_DESCRIPTION_NOT_STARTING_WITH_WHETHER` is discarded
   * when there is a log on same line for `NON_STANDARD_RETURNALL_DESCRIPTION`.
   */
  private removeRedundantLogs(logs: Log[]) {
    const [possiblyRedundant, others] = this.separate(logs, (log) =>
      this.isPossiblyRedundant(log)
    );

    if (
      possiblyRedundant.length === 2 &&
      possiblyRedundant[0].line === possiblyRedundant[1].line
    ) {
      return [
        ...others,
        ...possiblyRedundant.filter((log) => this.isReturnAll(log)),
      ];
    }

    return logs;
  }

  public isPossiblyRedundant(log: Log) {
    return (
      log.message ===
        this.config.lintings.BOOLEAN_DESCRIPTION_NOT_STARTING_WITH_WHETHER
          .message ||
      log.message ===
        this.config.lintings.NON_STANDARD_RETURNALL_DESCRIPTION.message
    );
  }

  private isReturnAll(log: Log) {
    return (
      log.message ===
      this.config.lintings.NON_STANDARD_RETURNALL_DESCRIPTION.message
    );
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
