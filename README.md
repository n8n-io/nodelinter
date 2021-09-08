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

**Nodelinter** is a static code analyzer for n8n node files, with ~70 linting rules for:

- default values based on param type,
- casing for display names and descriptions,
- alphabetization for params and options,
- required and optional key-value pairs,
- expected values for specific params,
- etc.

See [full lintings list](./src/lintings.ts).

## Operation

Run via npx:

```sh
npx nodelinter --target=/Users/john/n8n/packages/nodes-base/nodes/Stripe/Stripe.node.ts
```

Or run locally:

```sh
git clone https://github.com/n8n-io/nodelinter
cd nodelinter; npm i
npm run lint -- --target=/Users/john/n8n/packages/nodes-base/nodes/Stripe/Stripe.node.ts
```

### Options

| Option            | Effect                                             |
| ----------------- | -------------------------------------------------- |
| `--target`        | Path of the file or directory to lint              |
| `--config`        | Path of the [custom config](#custom-config) to use |
| `--print`         | Whether to print output to `lintOutput.json`       |
| `--patterns`      | Lintable file patterns                             |
| `--errors-only`   | Enable error logs only                             |
| `--warnings-only` | Enable warning logs only                           |
| `--infos-only`    | Enable info logs only                              |

Examples:

```sh
# lint a single file
--target=./packages/nodes-base/nodes/Stripe/Stripe.node.ts

# lint all files in a dir
--target=./packages/nodes-base/nodes/Stripe

# use a custom config
--config=/Users/john/Documents/myConfig.json

# print logs to lintOutput.json
--print

# lint files ending with these patterns
--target=./src/input/MyNode --patterns:.node.ts,Description.ts

# lint files ending with this pattern
--target=./src/input/MyNode --patterns:.node.ts

# lint only rules with error classification
--target=./src/input/MyNode --errors-only
```

### Custom config

You can override the Nodelinter [default config](./src/defaultConfig.ts) with a custom config.

To do so, create a JSON file containing any keys to overwrite:

```json
{
  "target": "/Users/john/n8n/packages/nodes-base/nodes/Notion/Notion.node.ts",
  "patterns": [".node.ts"],
  "sortMethod": "lineNumber",
  "lintings": {
    "PARAM_DESCRIPTION_MISSING_WHERE_OPTIONAL": {
      "enabled": false
    },
    "NAME_WITH_NO_CAMELCASE": {
      "enabled": false
    }
  }
}
```

And use the `--config` option:

```sh
npx nodelinter --config=/Users/john/Documents/myConfig.json
```

For convenience, when running locally, if you place a custom config file named `nodelinter.config.json` anywhere inside the nodelinter dir, the custom config file will be auto-detected.

### Lint exceptions

Add `// nodelinter-ignore-next-line LINTING_NAME` to except the next line from one or more specific lintings:

```
// nodelinter-ignore-next-line PARAM_DESCRIPTION_WITH_EXCESS_WHITESPACE
description: 'Time zone used in the response.    The default is the time zone of the calendar.',

// nodelinter-ignore-next-line PARAM_DESCRIPTION_WITH_EXCESS_WHITESPACE PARAM_DESCRIPTION_UNTRIMMED
description: 'Time zone used in the response.    The default is the time zone of the calendar.   ',
```

Or add `// nodelinter-ignore-next-line` to except the next line from all lintings:

```
// nodelinter-ignore-next-line
description: 'Time zone used in the response.    The default is the time zone of the calendar.',
```

<!-- ## Classification

Lintings are tagged with one or more **lint areas**, i.e. the section of code affected by the linting, such as `default` (default values), `displayName` (user-facing names for params and options), `limit` (limit params), etc.

Every linting also flags a single **lint issue**, i.e. the type of problem flagged by the linting, such as `alphabetization` (alphabetical sorting of params or options), `casing` (proper casing for user-facing param names and options), `missing` (for missing context-dependent key-value pairs), etc.

Lintings can be toggled on and off by lint area, by lint issue, or individually. -->

## Author

© 2021 [Iván Ovejero](https://github.com/ivov)

## License

Distributed under the [MIT License](LICENSE.md).
