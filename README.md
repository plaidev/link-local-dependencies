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
