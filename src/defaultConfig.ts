import { LINTINGS } from "./lintings";

export const defaultConfig: Config = {
  /**
   * Path of file to lint or of the dir whose lintable files to lint.
   */
  target: "",

  /**
   * Filename end patterns to determine which files is lintable when targeting a dir.
   * Only ".node.ts" and "Description.ts" allowed.
   */
  patterns: [".node.ts", "Description.ts"],

  /**
   * Log sorting method, either `lineNumber` (ascending) or `importance` (error → warning → info).
   */
  sortMethod: "lineNumber",

  /**
   * Whether to show details for lint messages, where available.
   */
  showDetails: true,

  /**
   * Whether to extract all param descriptions instead of linting.
   */
  extractDescriptions: false,

  /**
   * Hex values e.g. `#FFFFFF` to customize log level colors in stdout. Hash symbol `#` required.
   */
  logLevelColors: {
    error: "",
    warning: "",
    info: "",
  },

  /**
   * Number of characters allowed per line in the terminal screen.
   */
  lineWrapChars: 60,

  /**
   * Whether to truncate source code excerpts and up to how many characters.
   */
  truncateExcerpts: {
    enabled: true,
    charLimit: 60,
  },

  /**
   * Toggle logs state based on log level, lint area, and lint issue.
   */
  enable: {
    logLevels: {
      error: true,
      warning: true,
      info: true,
    },
    lintAreas: {
      default: true,
      displayName: true,
      limit: true,
      miscellaneous: true,
      name: true,
      nodeDescription: true,
      options: true,
      paramDescription: true,
    },
    lintIssues: {
      alphabetization: true,
      casing: true,
      icon: true,
      location: true,
      missing: true,
      naming: true,
      punctuation: true,
      unneeded: true,
      whitespace: true,
      wording: true,
      wrong: true,
    },
  },

  lintings: LINTINGS,
};
