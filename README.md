# Link local dependencies

```package.json

{
  "scripts": {
    "postinstall": "npx link-local-dependencies"
  },
  "localDependencies": {
    "pacakgeA": "./packages/packageA"
  }
}

```