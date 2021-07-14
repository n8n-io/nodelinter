export const STANDARD_DESCRIPTIONS = {
  limit: "How many results to return",
  returnAll: "Whether to return all results or only up to a given limit",
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
  upsertOptionName: "Create or Update",
  upsertOptionDescription:
    "Create a new record, or update the current one if it already exists (upsert)",
};

export const WEAK_DESCRIPTIONS = [
  "The operation to perform",
  "Method of authentication",
];

export const SVG_ICON_SOURCES = [
  "https://vecta.io/symbols",
  "https://github.com/gilbarbara/logos",
];

/**
 * Technical terms that need to be replaced with user-friendly versions.
 */
export const TECHNICAL_TERMS = ["string", "field"];

export const ERRORS = {
  UNKNOWN_KEY_IN_CUSTOM_CONFIG: "Invalid custom config: Unknown key",
  FAILED_TO_IMPORT_CONFIG_FILE:
    "Failed to import config file: Ensure the path specified with --config is a valid JSON config file",
  OVERSPECIFIED_TARGET:
    "Overspecified target path: Specify the target path once - either as a CLI flag or in the config file",
  UNSPECIFIED_TARGET:
    "Unspecified target path: Specify the target path either as a CLI flag or in the config file",
  CONFIG_AUTODETECTION_FAILED:
    "Autodetection of `nodelinter.config.json` failed",
  FAILED_TO_FIND_TARGET: "No such file or directory",
};

/**
 * How many items (inclusive) constitute a long listing, which requires alphabetization.
 */
export const LONG_LISTING_LIMIT = 5;
