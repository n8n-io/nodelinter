import chalk from "chalk";

export const ERRORS = {
  FAILED_TO_IMPORT_CONFIG_FILE:
    "Failed to import config file: Ensure the path specified with -c or --config is a valid JSON config file.",
  OVERSPECIFIED_TARGET:
    "Overspecified target path: Specify the target path once - either as a CLI flag or in the config file.",
  INVALID_CUSTOM_CONFIG: "Invalid custom config: Unknown key",
  UNSPECIFIED_TARGET:
    "Unspecified target path: Specify the target path either as a CLI flag or in the config file.",
};

export const showError = (errorMessage: string) =>
  console.log(
    [
      chalk.red.inverse("error".padStart(7, " ").padEnd(9, " ").toUpperCase()),
      chalk.bold(errorMessage),
      "\n",
    ].join(" ")
  );
