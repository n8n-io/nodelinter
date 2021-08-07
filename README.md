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

Run via npx:

```sh
npx nodelinter --option
```

Or locally:

```sh
git clone https://github.com/ivov/nodelinter
cd nodelinter; npm i
npm run lint -- --option
```

Primary options:

| Option     | Effect                                                        | Type              |
| ---------- | ------------------------------------------------------------- | ----------------- |
| `--target` | Lint this file or all files in this dir (recursive)           | String            |
| `--config` | Use a [custom config](#custom-config) to override the default | String            |
| `--print`  | Print output to JSON - if with arg, name the output file      | Boolean or String |

```sh
npx nodelinter --target=/Users/john/n8n/packages/nodes-base/nodes/Stripe/Stripe.node.ts
npx nodelinter --target=/Users/john/n8n/packages/nodes-base/nodes/Stripe
npx nodelinter --config=/Users/john/Documents/myCustomConfig.json
npx nodelinter --print
npx nodelinter --print=myLintOutput
```

Secondary options:

| Option            | Effect                                                                                                                                 | Type                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `--patterns`      | [Lintable file patterns](https://github.com/ivov/nodelinter/blob/0236d5d767a3a2c1ef51163bd5052e8e87059b82/src/defaultConfig.ts#L9-L13) | Comma-separated string |
| `--errors-only`   | Enable error logs only                                                                                                                 | Boolean                |
| `--warnings-only` | Enable warning logs only                                                                                                               | Boolean                |
| `--infos-only`    | Enable info logs only                                                                                                                  | Boolean                |

```sh
npx nodelinter --target=./src/input/MyNode --patterns:.node.ts,Description.ts
npx nodelinter --target=./src/input/MyNode --patterns:.node.ts
npx nodelinter --target=./src/input/MyNode --errors-only
```

Secondary options are applied last, overriding custom and default configs.

### Custom config

The Nodelinter [default config](./src/defaultConfig.ts) can be overridden by a custom config.

To override it, create a JSON file containing any keys to overwrite:

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

And set the `--config` option to specify the path to it:

```sh
--config=/Users/john/Documents/myCustomConfig.json
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

## Pending

- More lintings
- Add GitHub link as lint target
- Add PR diff as lint target
- Add `GenericFunctions.ts` as lint target
- Add redesigned nodes as lint target
- Validate custom config file in full
- Create PoC to auto-fix lintings
- Write Contribution guide

## Author

© 2021 [Iván Ovejero](https://github.com/ivov)

## License

Distributed under the [MIT License](LICENSE.md).
