export const STANDARD_DESCRIPTIONS = {
  limit: "Max number of results to return",
  returnAll: "Whether to return all results or only up to a given limit",
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
  upsert:
    "Create a new record, or update the current one if it already exists (upsert)",
  simplifyResponse:
    "Whether to return a simplified version of the response instead of the raw data",
};

export const STANDARD_NAMES = {
  simplifyResponse: "Simplify Response",
  upsert: "Create or Update", // option
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
 * Technical terms to be replaced with user-friendly versions.
 */
export const TECHNICAL_TERMS = ["string", "field"];

/**
 * British English suffixes to be replaced with their American equivalents.
 */
export const BRITISH_ENGLISH_SUFFIXES = ["yse", "ise", "our"];

export const ERRORS = {
  UNKNOWN_KEY: {
    title: "Invalid key",
    message: "Unknown key found in custom config file",
  },
  UNKNOWN_OPTION: {
    title: "Invalid option",
    message: "Unknown option passed in",
  },
  FAILED_TO_IMPORT_CUSTOM_CONFIG: {
    title: "Failed to import config file",
    message:
      "Ensure the path specified with --config is a valid JSON config file",
  },
  OVERSPECIFIED_TARGET: {
    title: "Overspecified target",
    message:
      "Specify one target, either as a CLI flag with --target or as a key in the config file, not both",
  },
  UNSPECIFIED_TARGET: {
    title: "Unspecified target",
    message:
      "Specify the target path (file or dir to lint) either as a CLI flag with --target or as a key in the config file",
  },
  CONFIG_AUTODETECTION_FAILED: {
    title: "Autodetection of `nodelinter.config.json` failed",
  },
  FAILED_TO_FIND_TARGET_AT_PATH: {
    title: "No such target",
    message: "There is no file or dir at the path specified by the target key",
  },
  MULTIPLE_ONLY_ARGS: {
    title: "Multiple `--*-only` flags detected",
    message:
      "Specify one of: `--errors-only`, `--warnings-only`, `--infos-only`",
  },
  INVALID_PATTERNS: {
    title: "One or more invalid patterns detected",
    message:
      "Specify: `.node.ts` or `Description.ts` or `.node.ts, Description.ts`",
  },
  NOT_LINTABLE_TARGET: {
    title: "Non-lintable target",
    message: "Target a filepath that ends with `.node.ts` or `Description.ts`.",
  },
};

/**
 * How many items (inclusive) constitute a long listing, which requires alphabetization.
 */
export const LONG_LISTING_LIMIT = 5;

/**
 * Filename end patterns that the nodelinter is able to lint.
 */
export const LINTABLE_FILE_PATTERNS = [".node.ts", "Description.ts"];

/**
 * Default filename for logs printed with the `--print` option when leaving the filename unspecified.
 */
export const DEFAULT_PRINT_FILENAME = "lintOutput";

/**
 * Default filename for autodetectable nodelinter config.
 */
export const DEFAULT_AUTODETECT_FILENAME = "nodelinter.config.json";

/**
 * Start text for the comment that creates a lint exception for the next line in the source.
 */
export const NEXT_LINE_EXCEPTION_TEXT = "// nodelinter-ignore-next-line";
