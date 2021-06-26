// ----------------------------------
//             config
// ----------------------------------

type Config = {
  n8nRepoPath: string;
  lintAreasEnabled: { [key in LintArea]: boolean };
  lintIssuesEnabled: { [key in LintIssue]: boolean };
  truncation: {
    enabled: boolean;
    charLimit: number;
  };
};

// ----------------------------------
//             lint
// ----------------------------------

type Linting = {
  lintArea: LintArea;
  lintIssue: LintIssue;
  message: string;
  enabled: boolean;
  logLevel: LogLevel;
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
  | "wording";

// ----------------------------------
//             log
// ----------------------------------

type Log = {
  lintArea: LintArea;
  lintIssue: string;
  message: string;
  line: number;
  excerpt: string;
  sourceFilePath: string;
  logLevel: LogLevel;
};

type LogLevel = "info" | "warning" | "error";

type LogFunction = (linting: Linting) => (node: ts.Node) => void;

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
