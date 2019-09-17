import linkLocalDeps from './link-local-deps'

function main() {
  const currentDir = process.cwd()
  linkLocalDeps(currentDir)
}

main()
