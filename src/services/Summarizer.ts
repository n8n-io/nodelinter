export class Summarizer {
  static run(errorLog: Log[], executionTimeMs: number) {
    let errors = 0;
    let warnings = 0;
    let infos = 0;

    errorLog.forEach((error) => {
      if (error.logLevel === "error") errors++;
      if (error.logLevel === "warning") warnings++;
      if (error.logLevel === "info") infos++;
    });

    return {
      errors,
      warnings,
      infos,
      total: errorLog.length,
      executionTimeMs,
    };
  }
}
