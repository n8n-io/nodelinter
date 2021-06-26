export const LINTINGS: {
  [key in string]: Linting;
} = {
  WRONG_DEFAULT_FOR_STRING_TYPE_PARAM: {
    lintArea: "default",
    lintIssue: "wrong",
    message: "Non-string default for string-type param",
    enabled: true,
    logLevel: "error",
  },
  WRONG_DEFAULT_FOR_NUMBER_TYPE_PARAM: {
    lintArea: "default",
    lintIssue: "wrong",
    message: "Non-numeric default for number-type param",
    enabled: true,
    logLevel: "error",
  },
  WRONG_DEFAULT_FOR_BOOLEAN_TYPE_PARAM: {
    lintArea: "default",
    lintIssue: "wrong",
    message: "Non-boolean default for boolean-type param",
    enabled: true,
    logLevel: "error",
  },
  WRONG_DEFAULT_FOR_COLLECTION_TYPE_PARAM: {
    lintArea: "default",
    lintIssue: "wrong",
    message: "Non-object default for collection-type param",
    enabled: true,
    logLevel: "error",
  },
  WRONG_DEFAULT_FOR_MULTIOPTIONS_TYPE_PARAM: {
    lintArea: "default",
    lintIssue: "wrong",
    message: "Non-array default for multiOptions-type param",
    enabled: true,
    logLevel: "error",
  },
  WRONG_DEFAULT_FOR_OPTIONS_TYPE_PARAM: {
    lintArea: "default",
    lintIssue: "wrong",
    message: "Non-option default for options-type param",
    enabled: true,
    logLevel: "error",
  },
  DEFAULT_MISSING: {
    lintArea: "default",
    lintIssue: "missing",
    message: "Default value missing for param",
    enabled: true,
    logLevel: "error",
  },

  DISPLAYNAME_WITH_MISCASED_ID: {
    lintArea: "displayName",
    lintIssue: "casing",
    message: "Miscased `ID` in `displayName` property",
    enabled: true,
    logLevel: "error",
  },
  DISPLAYNAME_WITH_NO_TITLECASE: {
    lintArea: "displayName",
    lintIssue: "casing",
    message: "No title case in `displayName` property",
    enabled: true,
    logLevel: "error",
  },

  LIMIT_WITHOUT_TYPE_OPTIONS: {
    lintArea: "limit",
    lintIssue: "missing",
    message: "Limit without `typeOptions`",
    enabled: true,
    logLevel: "error",
  },
  LIMIT_WITH_MIN_VALUE_LOWER_THAN_ONE: {
    lintArea: "limit",
    lintIssue: "missing",
    message: "Limit with minimum value lower than one",
    enabled: true,
    logLevel: "error",
  },
  WRONG_DEFAULT_FOR_LIMIT_PARAM: {
    lintArea: "limit", // and default
    lintIssue: "wrong",
    message: "Non-50 default for limit param",
    enabled: true,
    logLevel: "error",
  },

  REQUIRED_FALSE: {
    lintArea: "miscellaneous",
    lintIssue: "unneeded",
    message: "Unneeded `required: false` in param property",
    enabled: true,
    logLevel: "warning",
  },

  NAME_WITH_MISCASED_ID: {
    lintArea: "name",
    lintIssue: "casing",
    message: "Miscased `id` in `name` property",
    enabled: true,
    logLevel: "error",
  },
  NAME_WITH_NO_CAMELCASE: {
    lintArea: "name",
    lintIssue: "casing",
    message: "No camel case in `name` property",
    enabled: true,
    logLevel: "error",
  },
  AUTHENTICATION_PROPERTY_NOT_IN_CREDENTIALS: {
    lintArea: "name",
    lintIssue: "location",
    message: "Authentication param should be in credentials",
    enabled: true,
    logLevel: "info",
  },

  PNG_ICON_IN_NODE_DESCRIPTION: {
    lintArea: "nodeDescription",
    lintIssue: "icon",
    message: "Icon is PNG instead of SVG in node description",
    enabled: true,
    logLevel: "error",
  },
  SUBTITLE_MISSING_IN_NODE_DESCRIPTION: {
    lintArea: "nodeDescription",
    lintIssue: "missing",
    message: "Missing `subtitle` in node description",
    enabled: true,
    logLevel: "error",
  },
  DISPLAYNAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION: {
    lintArea: "nodeDescription", // and displayName
    lintIssue: "naming",
    message:
      "Display name in trigger node description not ending with 'Trigger'",
    enabled: true,
    logLevel: "error",
  },
  NAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION: {
    lintArea: "nodeDescription", // and name
    lintIssue: "naming",
    message: "Name in trigger node description not ending with 'trigger'",
    enabled: true,
    logLevel: "error",
  },

  NON_ALPHABETIZED_OPTIONS: {
    lintArea: "options",
    lintIssue: "alphabetization",
    message: "Non-alphabetized `options` values in options-type param",
    enabled: true,
    logLevel: "error",
  },
  UPSERT_OPTION_WITH_WRONG_NAME: {
    lintArea: "options",
    lintIssue: "wrong",
    message: "Option for upsert is not named 'Create or Update'",
    enabled: true,
    logLevel: "error",
  },
  UPSERT_OPTION_WITH_WRONG_DESCRIPTION: {
    lintArea: "options",
    lintIssue: "wrong",
    message:
      "Option for upsert is not described 'Create a new record, or update the current one if it already exists (upsert)'",
    enabled: true,
    logLevel: "error",
  },

  PARAM_DESCRIPTION_WITH_UNCAPITALIZED_INITIAL: {
    lintArea: "paramDescription",
    lintIssue: "casing",
    message: "Non-capital initial letter in param description",
    enabled: true,
    logLevel: "error",
  },
  PARAM_DESCRIPTION_WITH_EXCESS_FINAL_PERIOD: {
    lintArea: "paramDescription",
    lintIssue: "punctuation",
    message: "Excess final period in param description",
    enabled: true,
    logLevel: "error",
  },
  PARAM_DESCRIPTION_MISSING_WHERE_REQUIRED: {
    lintArea: "paramDescription",
    lintIssue: "missing",
    message: "Param description is missing where it is required",
    enabled: true,
    logLevel: "error",
  },
  PARAM_DESCRIPTION_MISSING_WHERE_OPTIONAL: {
    lintArea: "paramDescription",
    lintIssue: "missing",
    message: "Param description is missing where it is optional",
    enabled: true,
    logLevel: "info",
  },
  PARAM_DESCRIPTION_WITH_UNNEEDED_BACKTICKS: {
    lintArea: "paramDescription",
    lintIssue: "unneeded",
    message: "Param description has unneeded backticks",
    enabled: true,
    logLevel: "warning",
  },
  ANCHOR_LINK_WITH_TARGET_BLANK_MISSING: {
    lintArea: "paramDescription",
    lintIssue: "missing",
    message: 'Anchor link has no attribute target="_blank"',
    enabled: true,
    logLevel: "error",
  },
  PARAM_DESCRIPTION_AS_EMPTY_STRING: {
    lintArea: "paramDescription",
    lintIssue: "missing",
    message: "Param description is an empty string",
    enabled: true,
    logLevel: "error",
  },
  PARAM_DESCRIPTION_UNTRIMMED: {
    lintArea: "paramDescription",
    lintIssue: "whitespace",
    message: "Param description is untrimmed",
    enabled: true,
    logLevel: "warning",
  },
  BOOLEAN_DESCRIPTION_NOT_STARTING_WITH_WHETHER: {
    lintArea: "paramDescription",
    lintIssue: "wording",
    message: "Boolean param description not starting with 'Whether'",
    enabled: true,
    logLevel: "warning",
  },
  WEAK_PARAM_DESCRIPTION: {
    lintArea: "paramDescription",
    lintIssue: "wording",
    message: "Weak param description to be improved or omitted",
    enabled: true,
    logLevel: "warning",
  },
};
