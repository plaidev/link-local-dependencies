import path from "path";
import fs from "fs";
import assert from "assert";
import linkLocalDeps from "../src/link-local-deps";
import os from "os";

const projectPath = path.resolve(os.tmpdir(), "./test-project");

const packageJsonPath = path.resolve(projectPath, "./package.json");
const packageJson = {
  localDependencies: {
    packageA: "./packageA",
    packageB: "./packages/packageB",
  },
};
const packageAPath = path.resolve(
  projectPath,
  packageJson.localDependencies.packageA
);
const packageBPath = path.resolve(
  projectPath,
  packageJson.localDependencies.packageB
);

const entityInPackageAPath = path.resolve(packageAPath, "./entity");
const entityInPackageBPath = path.resolve(packageBPath, "./entity");
const nodeModulesPath = path.resolve(projectPath, "./node_modules");

test("should work", () => {
  // setup project
  fs.mkdirSync(projectPath);
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
  fs.mkdirSync(packageAPath);
  fs.mkdirSync(packageBPath, { recursive: true });
  fs.writeFileSync(entityInPackageAPath, "packageA");
  fs.writeFileSync(entityInPackageBPath, "packageB");

  linkLocalDeps(projectPath);

  const entityInPackageA = fs.readFileSync(
    path.resolve(nodeModulesPath, "./packageA", "./entity")
  );
  const entityInPackageB = fs.readFileSync(
    path.resolve(nodeModulesPath, "./packageB", "./entity")
  );

  // teardown project
  fs.rmSync(projectPath, { recursive: true });

  assert(entityInPackageA.toString() === "packageA");
  assert(entityInPackageB.toString() === "packageB");
});
