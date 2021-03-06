// ----------------------------------
//             config
// ----------------------------------

type Config = {
  target: string;
  patterns: LintableFilePattern[];
  sortMethod: "lineNumber" | "importance";
  showDetails: boolean;
  extractDescriptions: boolean;
  logLevelColors: {
    [key in LogLevel]: string; // hex color
  };
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
//      description extraction
// ----------------------------------

type ExtractedDescription = {
  description: string;
  line: number;
  sourceFilePath: string;
};

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

type Exception = {
  line: number; // one line before affected line
  lintingsToExcept: string[];
  exceptionType: "nextLine"; // TODO: Add more
};

type Comment = {
  text: string;
  line: number;
  pos: number;
  end: number;
};

type CommentBasedItem = {
  line: number;
  text: string;
};

type TsIgnoreComment = CommentBasedItem;

type ToDoComment = CommentBasedItem;

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
  lintArea?: LintArea; // TODO: Cannot type as static, so optional for now
  logs: Log[];
  log: LogFunction;
  run: (node: ts.Node) => Log[] | undefined;
}

interface SubValidatorConstructor {
  new (): SubValidator;
}

// ----------------------------------
//           CLI args
// ----------------------------------

type CliArgs = {
  _?: [];
  target?: string;
  config?: string;
  print?: boolean;
  patterns?: string;
} & MultiWordArgs;

type MultiWordArgs = {
  "errors-only"?: boolean;
  "warnings-only"?: boolean;
  "infos-only"?: boolean;
  "extract-descriptions"?: boolean;
};

type AdjustPatternArg = {
  from: string;
  to: LintableFilePattern;
};

// ----------------------------------
//             utils
// ----------------------------------

/**
 * Extend ObjectConstructor with a stricter type definition for `Object.keys()`
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

type Constructor = new (...args: any[]) => {};

interface String {
  unquote(): string;
  clean(): string;
}
