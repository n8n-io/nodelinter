import chalk from "chalk";
import {
  STANDARD_DESCRIPTIONS,
  STANDARD_NAMES,
  SVG_ICON_SOURCES,
} from "./constants";

export const LINTINGS: {
  [LintingName: string]: Linting;
} = {
  WRONG_DEFAULT_FOR_STRING_TYPE_PARAM: {
    lintAreas: ["default"],
    lintIssue: "wrong",
    message: "Non-string default for `string`-type param",
    enabled: true,
    logLevel: "error",
    details:
      "The default value for a `string`-type param must be a string literal.",
  },
  WRONG_DEFAULT_FOR_NUMBER_TYPE_PARAM: {
    lintAreas: ["default"],
    lintIssue: "wrong",
    message: "Non-numeric default for `number`-type param",
    enabled: true,
    logLevel: "error",
    details:
      "The default value for a `number`-type param must be a numeric literal.",
  },
  WRONG_DEFAULT_FOR_BOOLEAN_TYPE_PARAM: {
    lintAreas: ["default"],
    lintIssue: "wrong",
    message: "Non-boolean default for `boolean`-type param",
    enabled: true,
    logLevel: "error",
    details:
      "The default value for a `boolean`-type param must be a boolean keyword.",
  },
  WRONG_DEFAULT_FOR_COLLECTION_TYPE_PARAM: {
    lintAreas: ["default"],
    lintIssue: "wrong",
    message: "Non-object default for `collection`-type param",
    enabled: true,
    logLevel: "error",
    details:
      "The default value for a `collection`-type param must be an object literal.",
  },
  WRONG_DEFAULT_FOR_MULTIOPTIONS_TYPE_PARAM: {
    lintAreas: ["default"],
    lintIssue: "wrong",
    message: "Non-array default for `multiOptions`-type param",
    enabled: true,
    logLevel: "error",
    details:
      "The default value for a `multiOptions`-type param must be an array literal.",
  },
  WRONG_DEFAULT_FOR_OPTIONS_TYPE_PARAM: {
    lintAreas: ["default"],
    lintIssue: "wrong",
    message: "Non-option default for `options`-type param",
    enabled: true,
    logLevel: "error",
    details:
      "The default value for an `options`-type param must be one of the options.",
  },
  WRONG_DEFAULT_FOR_SIMPLIFY_PARAM: {
    lintAreas: ["default"],
    lintIssue: "wrong",
    message: "Non-`true` default for Simplify Response param",
    enabled: true,
    logLevel: "error",
    details: "The default value for a Simplify Response param must be `true`.",
  },
  DEFAULT_MISSING: {
    lintAreas: ["default"],
    lintIssue: "missing",
    message: "Default value missing for param",
    enabled: true,
    logLevel: "error",
  },

  DISPLAYNAME_WITH_MISCASED_ID: {
    lintAreas: ["displayName"],
    lintIssue: "casing",
    message: "Miscased `ID` in `displayName` property",
    enabled: true,
    logLevel: "error",
    details: "`ID` must be all uppercase in every `displayName` property.",
  },
  DISPLAYNAME_NOT_UPDATE_FIELDS: {
    lintAreas: ["displayName"],
    lintIssue: "wrong",
    message: "Collection param for update operation not named 'Update Fields'",
    enabled: true,
    logLevel: "error",
  },
  DISPLAYNAME_WITH_NO_TITLECASE: {
    lintAreas: ["displayName"],
    lintIssue: "casing",
    message: "No title case in `displayName` property",
    enabled: true,
    logLevel: "error",
  },
  DISPLAYNAME_UNTRIMMED: {
    lintAreas: ["displayName"],
    lintIssue: "whitespace",
    message: "Display name is untrimmed",
    enabled: true,
    logLevel: "error",
  },
  NON_STANDARD_DISPLAY_NAME_FOR_SIMPLIFY_PARAM: {
    lintAreas: ["displayName"],
    lintIssue: "wording",
    message: "Non-standard name of Simplify Response param",
    enabled: true,
    logLevel: "info",
    details: `The standard display name of the simplify param is: ${chalk.bold(
      STANDARD_NAMES.simplifyResponse
    )}`,
  },

  LIMIT_WITHOUT_TYPE_OPTIONS: {
    lintAreas: ["limit"],
    lintIssue: "missing",
    message: "Limit param without `typeOptions`",
    enabled: true,
    logLevel: "error",
  },
  LIMIT_WITH_MIN_VALUE_LOWER_THAN_ONE: {
    lintAreas: ["limit"],
    lintIssue: "missing",
    message: "Limit param with min value lower than one",
    enabled: true,
    logLevel: "error",
  },
  WRONG_DEFAULT_FOR_LIMIT_PARAM: {
    lintAreas: ["limit", "default"],
    lintIssue: "wrong",
    message: "Non-50 default for `limit` param",
    enabled: true,
    logLevel: "error",
  },
  NON_STANDARD_LIMIT_DESCRIPTION: {
    lintAreas: ["limit"],
    lintIssue: "wording",
    message: "Non-standard description for `limit` param",
    enabled: true,
    logLevel: "info",
    details: `The standard description for \`limit\` is: ${chalk.bold(
      STANDARD_DESCRIPTIONS.limit
    )}`,
  },

  NON_EXISTENT_LOAD_OPTIONS_METHOD: {
    lintAreas: ["miscellaneous"],
    lintIssue: "wrong",
    message: "Param with non-existent `loadOptionsMethod`",
    enabled: true,
    logLevel: "error",
    details:
      "The method to load options specified for this param has not been defined in `methods.loadOptions` in the node.",
  },
  TS_IGNORE: {
    lintAreas: ["miscellaneous"],
    lintIssue: "wrong",
    message: "@ts-ignore comment detected",
    enabled: true,
    logLevel: "warning",
    details: "@ts-ignore comments suppress compilation errors.",
  },
  TODO: {
    lintAreas: ["miscellaneous"],
    lintIssue: "wrong",
    message: "TODO comment detected",
    enabled: true,
    logLevel: "warning",
  },
  REQUIRED_FALSE: {
    lintAreas: ["miscellaneous"],
    lintIssue: "unneeded",
    message: "Unneeded `required: false` in param property",
    enabled: true,
    logLevel: "warning",
    details:
      "The property assignment `required: false` is the default, so it does not need to be specified.",
  },
  NON_STANDARD_RETURNALL_DESCRIPTION: {
    lintAreas: ["miscellaneous"],
    lintIssue: "wording",
    message: "Non-standard description for `returnAll` param",
    enabled: true,
    logLevel: "info",
    details: `The standard description for \`returnAll\` is: ${chalk.bold(
      STANDARD_DESCRIPTIONS.returnAll
    )}`,
  },
  MISSING_CONTINUE_ON_FAIL: {
    lintAreas: ["miscellaneous"],
    lintIssue: "missing",
    message: "Missing implementation of `continueOnFail`",
    enabled: true,
    logLevel: "error",
    details:
      "Without `continueOnFail`, the node will have to stop processing items on any error.",
  },
  WRONG_ERROR_THROWN: {
    lintAreas: ["miscellaneous"],
    lintIssue: "wrong",
    message: "`Error` instead of `NodeApiError` or `NodeOperationError`",
    enabled: true,
    logLevel: "warning",
    details:
      "Use `NodeApiError` for unsuccessful API calls and `NodeOperationError` for functionality errors. Reference: n8n/packages/workflow/src/NodeErrors.ts",
  },

  NAME_WITH_MISCASED_ID: {
    lintAreas: ["name"],
    lintIssue: "casing",
    message: "Miscased `id` in `name` property",
    enabled: true,
    logLevel: "error",
    details: "`id` must be lowercase in every `name` property",
  },
  NAME_WITH_NO_CAMELCASE: {
    lintAreas: ["name"],
    lintIssue: "casing",
    message: "No camel case in `name` property",
    enabled: true,
    logLevel: "error",
  },
  NON_SUFFIXED_CREDENTIALS_NAME: {
    lintAreas: ["name"],
    lintIssue: "wording",
    message: "`name` in `credentials` property not suffixed with `Api`",
    enabled: true,
    logLevel: "error",
    details:
      "The `name` property in a `credentials` property in a node description must be suffixed with `Api`, e.g. `stripeApi` or `twilioOAuth2Api`",
  },
  AUTHENTICATION_PARAM_NOT_IN_CREDENTIALS: {
    lintAreas: ["name"],
    lintIssue: "location",
    message: "Authentication param should be in credentials",
    enabled: true,
    logLevel: "info",
    details:
      "Having the authentication param (allowing the user to select API key, OAuth2, etc.) in a node description is legacy node design. Relocate it to the credentials file at `packages/nodes-base/credentials/*.credentials.ts`.",
  },

  PNG_ICON_IN_NODE_DESCRIPTION: {
    lintAreas: ["nodeDescription"],
    lintIssue: "icon",
    message: "Icon is PNG instead of SVG in node description",
    enabled: true,
    logLevel: "warning",
    details: `Sources of SVG icons: ${chalk.bold(
      SVG_ICON_SOURCES.join(" | ")
    )}`,
  },
  SUBTITLE_MISSING_IN_NODE_DESCRIPTION: {
    lintAreas: ["nodeDescription"],
    lintIssue: "missing",
    message: "Missing `subtitle` in node description",
    enabled: true,
    logLevel: "error",
  },
  WRONG_NUMBER_OF_INPUTS_IN_REGULAR_NODE_DESCRIPTION: {
    lintAreas: ["nodeDescription"],
    lintIssue: "wrong",
    message: "Regular node with no input",
    enabled: true,
    logLevel: "error",
    details: "A regular node must have one or more inputs",
  },
  WRONG_NUMBER_OF_INPUTS_IN_TRIGGER_NODE_DESCRIPTION: {
    lintAreas: ["nodeDescription"],
    lintIssue: "wrong",
    message: "Trigger node with non-zero input",
    enabled: true,
    logLevel: "error",
    details: "A trigger node must not have for any inputs",
  },
  WRONG_NUMBER_OF_OUTPUTS_IN_NODE_DESCRIPTION: {
    lintAreas: ["nodeDescription"],
    lintIssue: "wrong",
    message: "Node with no output",
    enabled: true,
    logLevel: "error",
    details: "Every node must have one or more outputs",
  },
  NON_STANDARD_SUBTITLE: {
    lintAreas: ["nodeDescription"],
    lintIssue: "wording",
    message: "Non-standard `subtitle` in node description",
    enabled: true,
    logLevel: "info",
    details: `The standard node description subtitle is: ${chalk.bold(
      STANDARD_DESCRIPTIONS.subtitle
    )}`,
  },
  DISPLAYNAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION: {
    lintAreas: ["nodeDescription", "displayName"],
    lintIssue: "naming",
    message:
      "Display name in trigger node description not ending with ' Trigger'",
    enabled: true,
    logLevel: "error",
  },
  NAME_NOT_ENDING_WITH_TRIGGER_IN_NODE_DESCRIPTION: {
    lintAreas: ["nodeDescription", "name"],
    lintIssue: "naming",
    message: "Name in trigger node description not ending with 'Trigger'",
    enabled: true,
    logLevel: "error",
  },

  NON_ALPHABETIZED_OPTIONS_IN_OPTIONS_TYPE_PARAM: {
    lintAreas: ["options"],
    lintIssue: "alphabetization",
    message: "Non-alphabetized `options` in `options`-type param",
    enabled: true,
    logLevel: "error",
    details: "Listings of >5 items must be alphabetized",
  },
  NON_ALPHABETIZED_OPTIONS_IN_MULTIOPTIONS_TYPE_PARAM: {
    lintAreas: ["options"],
    lintIssue: "alphabetization",
    message: "Non-alphabetized `options` in `multiOptions`-type param",
    enabled: true,
    logLevel: "error",
    details: "Listings of >5 items must be alphabetized",
  },
  NON_ALPHABETIZED_OPTIONS_IN_COLLECTION_TYPE_PARAM: {
    lintAreas: ["options"],
    lintIssue: "alphabetization",
    message: "Non-alphabetized `options` in `collection`-type param",
    enabled: true,
    logLevel: "error",
    details: "Listings of >5 items must be alphabetized",
  },
  NON_ALPHABETIZED_VALUES_IN_FIXED_COLLECTION_TYPE_PARAM: {
    lintAreas: ["options"], // strictly `values`, but functionally same as `options`
    lintIssue: "alphabetization",
    message: "Non-alphabetized `values` in `fixedCollection`-type param",
    enabled: true,
    logLevel: "error",
    details: "Listings of >5 items must be alphabetized",
  },
  FIXED_COLLECTION_VALUE_DISPLAY_NAME_WITH_NO_TITLECASE: {
    lintAreas: ["options", "displayName"], // strictly `values`, but functionally same as `options`
    lintIssue: "casing",
    message: "No title case in `fixedCollection` value display name",
    enabled: true,
    logLevel: "error",
  },
  OPTIONS_NAME_WITH_NO_TITLECASE: {
    lintAreas: ["options"],
    lintIssue: "casing",
    message: "No title case in `options` name",
    enabled: true,
    logLevel: "error",
  },
  OPTIONS_VALUE_WITH_NO_CAMELCASE: {
    lintAreas: ["options"],
    lintIssue: "casing",
    message: "No camel case in `options` value",
    enabled: true,
    logLevel: "error",
  },

  NON_STANDARD_NAME_FOR_UPSERT_OPTION: {
    lintAreas: ["options"],
    lintIssue: "wording",
    message: "Non-standard name of upsert option",
    enabled: true,
    logLevel: "info",
    details: `The standard upsert option name is: ${chalk.bold(
      STANDARD_NAMES.upsert
    )}`,
  },
  NON_STANDARD_DESCRIPTION_FOR_UPSERT_OPTION: {
    lintAreas: ["options"],
    lintIssue: "wording",
    message: "Non-standard description of upsert option",
    enabled: true,
    logLevel: "info",
    details: `The standard upsert option description is: ${chalk.bold(
      STANDARD_DESCRIPTIONS.upsert
    )}`,
  },

  NON_STANDARD_DESCRIPTION_FOR_SIMPLIFY_PARAM: {
    lintAreas: ["paramDescription"],
    lintIssue: "wording",
    message: "Non-standard description of simplify param",
    enabled: true,
    logLevel: "info",
    details: `The standard description of the simplify param is: ${chalk.bold(
      STANDARD_DESCRIPTIONS.simplifyResponse
    )}`,
  },
  PARAM_DESCRIPTION_WITH_MISCASED_ID: {
    lintAreas: ["paramDescription"],
    lintIssue: "casing",
    message: "Miscased `ID` in param description",
    enabled: true,
    logLevel: "error",
    details: "`ID` must be all uppercase in any param description",
  },
  PARAM_DESCRIPTION_WITH_UNCAPITALIZED_INITIAL: {
    lintAreas: ["paramDescription"],
    lintIssue: "casing",
    message: "Non-capital initial letter in param description",
    enabled: true,
    logLevel: "error",
  },
  PARAM_DESCRIPTION_WITH_MISSING_FINAL_PERIOD: {
    lintAreas: ["paramDescription"],
    lintIssue: "punctuation",
    message: "Missing final period in multiple-sentence param description",
    enabled: true,
    logLevel: "warning",
  },
  PARAM_DESCRIPTION_WITH_EXCESS_FINAL_PERIOD: {
    lintAreas: ["paramDescription"],
    lintIssue: "punctuation",
    message: "Excess final period in single-sentence param description",
    enabled: true,
    logLevel: "warning",
  },
  PARAM_DESCRIPTION_WITH_EXCESS_WHITESPACE: {
    lintAreas: ["paramDescription"],
    lintIssue: "punctuation",
    message: "Excess whitespace in param description",
    enabled: true,
    logLevel: "warning",
  },
  PARAM_DESCRIPTION_MISSING_WHERE_REQUIRED: {
    lintAreas: ["paramDescription"],
    lintIssue: "missing",
    message: "Param description is missing where it is required",
    enabled: true,
    logLevel: "error",
    details:
      "All param and options descriptions are required, except for resource option, credentials option, and defaults option",
  },
  PARAM_DESCRIPTION_MISSING_WHERE_OPTIONAL: {
    lintAreas: ["paramDescription"],
    lintIssue: "missing",
    message: "Param description is missing where it is optional",
    enabled: true, // usually disabled
    logLevel: "info",
    details:
      "The only optional descriptions are resource option, credentials option, and defaults option",
  },
  PARAM_DESCRIPTION_WITH_UNNEEDED_BACKTICKS: {
    lintAreas: ["paramDescription"],
    lintIssue: "unneeded",
    message: "Param description with unneeded backticks",
    enabled: true,
    logLevel: "warning",
  },
  PARAM_DESCRIPTION_AS_EMPTY_STRING: {
    lintAreas: ["paramDescription"],
    lintIssue: "missing",
    message: "Param description as empty string",
    enabled: true,
    logLevel: "error",
  },
  PARAM_DESCRIPTION_WITH_BRITISH_SUFFIX: {
    lintAreas: ["paramDescription"],
    lintIssue: "wording",
    message: "Param description is using British English",
    enabled: true,
    logLevel: "warning",
    details:
      "Prefer American English over British English suffixes, i.e. prefer '-ize' over '-ise', '-ize' over '-yse', and '-our' over '-our'",
  },
  PARAM_DESCRIPTION_UNTRIMMED: {
    lintAreas: ["paramDescription"],
    lintIssue: "whitespace",
    message: "Param description is untrimmed",
    enabled: true,
    logLevel: "warning",
  },
  BOOLEAN_DESCRIPTION_NOT_STARTING_WITH_WHETHER: {
    lintAreas: ["paramDescription"],
    lintIssue: "wording",
    message: "Boolean param description not starting with 'Whether'",
    enabled: true,
    logLevel: "warning",
  },
  WEAK_PARAM_DESCRIPTION: {
    lintAreas: ["paramDescription"],
    lintIssue: "wording",
    message: "Weak param description to improve or omit",
    enabled: true,
    logLevel: "warning",
  },
  PARAM_DESCRIPTION_IDENTICAL_TO_DISPLAY_NAME: {
    lintAreas: ["paramDescription", "displayName"],
    lintIssue: "unneeded",
    message: "Param description identical to `displayName`",
    enabled: true,
    logLevel: "warning",
  },
  NON_STANDARD_HTML_LINE_BREAK: {
    lintAreas: ["paramDescription"],
    lintIssue: "unneeded",
    message: "Non-standard HTML element syntax for line break",
    enabled: true,
    logLevel: "info",
  },
  TECHNICAL_TERM_IN_PARAM_DESCRIPTION: {
    lintAreas: ["paramDescription"],
    lintIssue: "wording",
    message: "Technical term in param description",
    enabled: true,
    logLevel: "info",
    details: "Prefer 'text' over 'string' and 'field' over 'key'",
  },
};
