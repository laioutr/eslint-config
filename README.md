# Laioutr ESLint Config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

ESLint config for Laioutr projects.

See [laioutr.com](https://laioutr.com) for more information about Laioutr.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Installation

```bash
pnpm add -D @laioutr/eslint-config
```

## Quick Setup

This package exports the following configs:
- `@laioutr/eslint-config` - The default config for Laioutr projects, plus an additional `extendConfig` function for type-safe extension.
- `@laioutr/eslint-config/nuxt-app` - The config for Nuxt apps.
- `@laioutr/eslint-config/nuxt-module` - The config for Nuxt modules and Laioutr App packages.
- `@laioutr/eslint-config/next` - The config for Next.js apps.
- `@laioutr/eslint-config/oclif` - The config for Oclif apps.


## Publishing

To publish a new version, run `pnpm release`. This will:

- Update the changelog
- Publish the package to npmjs.org
- Push the changes to the repository

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@laioutr/eslint-config/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@laioutr/eslint-config
[npm-downloads-src]: https://img.shields.io/npm/dm/@laioutr/eslint-config.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@laioutr/eslint-config
[license-src]: https://img.shields.io/npm/l/@laioutr/eslint-config.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@laioutr/eslint-config
