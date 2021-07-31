// ----------------------------------
//             config
// ----------------------------------

type Config = {
  target: string;
  patterns: LintableFilePattern[];
  sortMethod: "lineNumber" | "importance";
  showDetails: boolean;
  logLevelColors: { [key in LogLevel]: string }; // hex color
  lineWrapChars: number;
  truncateExcerpts: {
    enabled: boolean;
    charLimit: number;
  };
  enable: {
    logLevels: { [key in LogLevel]: boolean };
    lintAreas: { [key in LintArea]: boolean };
    lintIssues: { [key in LintIssue]: boolean };
  };
  lintings: {
    [LintingName: string]: Linting;
  };
};

type LintableFilePattern = ".node.ts" | "Description.ts";

// ----------------------------------
//             lint
// ----------------------------------

type Linting = {
  lintAreas: LintArea[];
  lintIssue: LintIssue;
  message: string;
  enabled: boolean;
  logLevel: LogLevel;
  details?: string;
};

type ParameterType =
  | "string"
  | "number"
  | "boolean"
  | "collection"
  | "multiOptions"
  | "options";

type LintArea =
  | "default"
  | "displayName"
  | "limit"
  | "miscellaneous"
  | "name"
  | "nodeDescription"
  | "options"
  | "paramDescription";

type LintIssue =
  | "casing"
  | "alphabetization"
  | "missing"
  | "wrong"
  | "unneeded"
  | "icon"
  | "punctuation"
  | "whitespace"
  | "wording"
  | "naming"
  | "location";

// ----------------------------------
//             log
// ----------------------------------

type Log = Omit<Linting, "enabled"> & {
  line: number;
  excerpt: string;
  sourceFilePath: string;
};

type LogLevel = "info" | "warning" | "error";

type LogFunction = (linting: Linting) => (node: ts.Node) => void;

type LogSummary = {
  errors: number;
  warnings: number;
  infos: number;
  total: number;
  executionTimeMs: number;
};

// ----------------------------------
//           validation
// ----------------------------------

interface SubValidator {
  lintArea?: LintArea; // TODO: Make static instead of optional
  logs: Log[];
  log: LogFunction;
  run: (node: ts.Node) => Log[] | undefined;
}

interface SubValidatorConstructor {
  new (): SubValidator;
}

type CliArgs = {
  target?: string; // file path
  config?: string; // file path
  print?: boolean;
  patterns?: string | string[]; // comma-separated string from CLI, string[] after parsing
  "error-only"?: boolean;
  "warning-only"?: boolean;
  "info-only"?: boolean;
};

// ----------------------------------
//             utils
// ----------------------------------

/**
 * Extend ObjectConstructor with a better type definition for `Object.keys()`
 */
interface ObjectConstructor {
  keys<T>(object: T): ObjectKeys<T>;
}

type ObjectKeys<T> = T extends object
  ? (keyof T)[]
  : T extends number
  ? []
  : T extends Array<any> | string
  ? string[]
  : never;
