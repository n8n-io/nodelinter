<!-- <p align="center">
  <img src="logo.png" width="450" alt="Nodelinter logo" />
</p> -->

<p align="center">
  <h1 align="center">Nodelinter</h1>
</p>

<p align="center">
  Static code analyzer for n8n node files<br />
  by <a href="https://github.com/ivov">Iván Ovejero</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-work%20in%20progress-blue">
  <a href="https://github.com/n8n-io"><img src="https://img.shields.io/badge/org-n8n-ff6d5a"></a>
  <img src="https://img.shields.io/badge/license-MIT-brightgreen">
</p>

<br />

<!-- <p align="center">
  <img src="screenshot.png" width="450" alt="Nodelinter screenshot" />
</p> -->

**Nodelinter** is a static code analyzer for n8n node files, for linting:

- default values based on param type,
- casing for display names and descriptions,
- alphabetization for params and options,
- required and optional key-value pairs,
- expected values for specific params,
- codebase conventions and modern JS

See [full lintings list](./src/lintings.ts).

Lintable n8n node files:

- `*.node.ts` (main node file)
- `*Description.ts` (resource description file)

## Operation

```sh
npx nodelinter --option
```

| Option     | Effect                                                        | Type    |
| ---------- | ------------------------------------------------------------- | ------- |
| `--target` | Lint the file or all files in the dir at this path            | String  |
| `--config` | Use the config at this path - see [config file](#config-file) | String  |
| `--print`  | Print lint logs to a JSON file                                | Boolean |

<br />

Examples:

```sh
npx nodelinter --path=/Users/john/n8n/packages/nodes-base/nodes/Stripe/Stripe.node.ts
npx nodelinter --path=/Users/john/n8n/packages/nodes-base/nodes/Stripe
npx nodelinter --config=/Users/john/nodelinter/nodelinter.config.json --print
```

## Config file

The `--config` option specifies the path to the config file.

If the `--config` option is omitted, nodelinter will attempt to find a `nodelinter.config.json` inside the nodelinter dir - if none is found, it will fall back to the [default config](./src/defaultConfig.ts).

To override the default config, create a `nodelinter.config.json`, specify the path to it with the `--config` option (or place the config in the nodelinter dir) and populate it with the settings to override.

```json
{
  "target": "/Users/john/n8n/packages/nodes-base/nodes/Stripe/Stripe.node.ts",
  "sortMethod": "lineNumber",
  "showDetails": true,
  "lintings": {
    "PARAM_DESCRIPTION_MISSING_WHERE_OPTIONAL": {
      "enabled": false
    },
    "NAME_WITH_NO_CAMELCASE": {
      "enabled": false
    },
    "OPTIONS_VALUE_WITH_NO_CAMELCASE": {
      "enabled": false
    }
  }
}
```

**Note:** The file or dir to lint may be specified with the `--target` option or with the `target` key in the config file. If the target is specified in both, nodelinter will prompt the user to specify a single target.

<!-- ## Classification

Lintings are tagged with one or more **lint areas**, i.e. the section of code affected by the linting, such as `default` (default values), `displayName` (user-facing names for params and options), `limit` (limit params), etc.

Every linting also flags a single **lint issue**, i.e. the type of problem flagged by the linting, such as `alphabetization` (alphabetical sorting of params or options), `casing` (proper casing for user-facing param names and options), `missing` (for missing context-dependent key-value pairs), etc.

Lintings can be toggled on and off by lint area, by lint issue, or individually. -->

## Pending

- Refine lintings with exceptions
- Create more lintings
  - `displayOptions` check for `resource` and `operation`
  - unused imports
  - `name` in `credentials` in node description
  - missing `.node.json` codex file
  - `// tslint:disable-line: no-any`
  - `@ts-ignore`
- Add GitHub link as lint target
- Add PR diff as lint target
- Add `GenericFunctions.ts` as lint target
- Add redesigned nodes as lint target
- Add validation of custom config file
- Create PoC to auto-fix lintings
- Write Contribution guide

## Author

© 2021 [Iván Ovejero](https://github.com/ivov)

## License

Distributed under the [MIT License](LICENSE.md).
