import path from "path";
import chalk from "chalk";
import ansiEscapes from "ansi-escapes";

export class Presenter {
  public static showLogs(
    logs: Log[],
    { forN8nRepo: isN8nRepo } = { forN8nRepo: false }
  ) {
    logs.forEach((error) => {
      this.showFirstLine(error, { isN8nRepo });
      this.showSecondLine(error);
      this.showThirdLine(error);
      console.log();
    });
  }

  public static showSummary(summary: {
    errors: number;
    warnings: number;
    infos: number;
    total: number;
    executionTimeMs: number;
  }) {
    const error = this.getMessagePaint("error");
    const warning = this.getMessagePaint("warning");
    const info = this.getMessagePaint("info");
    const generic = chalk.white.bold;

    console.log(generic("Total\t\t") + generic(summary.total));
    console.log(error("  Errors\t") + error(summary.errors));
    console.log(warning("  Warnings\t") + warning(summary.warnings));
    console.log(info("  Infos\t\t") + info(summary.infos));
    console.log("Time\t\t" + summary.executionTimeMs + " ms");
  }

  private static showFirstLine(
    error: Log,
    { isN8nRepo }: { isN8nRepo: boolean }
  ) {
    const sourcePath = isN8nRepo
      ? this.formatSourceFilePath(error.sourceFilePath).split("packages")[1]
      : this.formatSourceFilePath(error.sourceFilePath);

    const linkPath = isN8nRepo
      ? `file://${error.sourceFilePath}`
      : path.join(`file://${path.resolve("./")}`, error.sourceFilePath);

    const linkText = sourcePath + this.formatLineNumber(error.line);

    const fileLink = ansiEscapes.link(linkText, linkPath);

    console.log(this.formatLogLevel(error.logLevel) + " " + fileLink);
  }

  private static showSecondLine(error: Log) {
    const secondLine = [
      this.formatMessage(error.message, error.logLevel),
      // this.formatlintArea(lintArea),
    ].join(" ");

    console.log(secondLine);
  }

  private static showThirdLine(error: Log) {
    console.log(`  ${chalk.grey(`» ${error.excerpt}`)}`);
  }

  private static formatMessage(message: string, logLevel: LogLevel) {
    const paint = this.getMessagePaint(logLevel);
    return paint(`  ${message}`);
  }

  private static formatlintArea(lintArea: LintArea) {
    return chalk.dim(`(${lintArea})`);
  }

  private static formatLogLevel(logLevel: LogLevel) {
    const paint = this.getLogLevelPaint(logLevel);

    const format = (logLevel: LogLevel) =>
      paint(this.pad(logLevel.toUpperCase()));

    return format(logLevel);
  }

  private static formatSourceFilePath(sourceFilePath: string) {
    const parts = sourceFilePath.split("/");
    const [fileName, ...basePath] = [parts.pop(), ...parts];

    return chalk.grey(basePath.join("/") + "/") + chalk.bold(fileName);
  }

  private static formatLineNumber(lineNumber: number) {
    return chalk.grey(":") + chalk.white(lineNumber);
  }

  private static pad(text: string, length = 11, char = " ") {
    return text.padStart((text.length + length) / 2, char).padEnd(length, char);
  }

  private static getLogLevelPaint(logLevel: LogLevel) {
    return {
      error: chalk.hex("#000000").bgRedBright.bold,
      warning: chalk.hex("#000000").bgYellowBright.bold,
      info: chalk.hex("#000000").bgBlueBright.bold,
    }[logLevel];
  }

  private static getMessagePaint(logLevel: LogLevel) {
    return {
      error: chalk.redBright.bold,
      warning: chalk.yellowBright.bold,
      info: chalk.blueBright.bold,
    }[logLevel];
  }
}
