# Link local dependencies

Just make relative symbolic links in local dependencies, not update, install or check differences.

## Usage

- package.json
```package.json

{
  "scripts": {
    "postinstall": "npx @plaidev/link-local-dependencies"
  },
  "localDependencies": {
    "packageA": "./packages/packageA"
  }
}

```

- js
```ts
import packageA from 'packageA';
const packageA = require('packageA');
```

- make links
```
$ npx @plaidev/link-local-dependencies
```

## Before you use

This package requires `node.js >= 10.12.0`, since we use fs.mkdir with recursive option.

## Why

We, dev members in plaid inc, are developping very big product which is written in nodejs with mono structured repository.
To develop mono structured repository with nodejs, we have to orchestrate multiple packages to harmonize each other. Luckily, there are some choices to handle it. For example, lerna is one of these, which is widely used in many mono structured projects. We tried several useful utilities, lerna, yarn workspace, pnpm workspace, and npm link. These utilities, however, were not suited to our case. Lerna forces us to unnecessarily learn extra usages, yarn hoisting breaks docker environment with too many filesytem use, pnpm breaks dependency solving, and npm link has fatal bugs! Eventually, we adopted an super simple solution - just linking -.
