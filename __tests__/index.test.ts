import path from "path";
import fs from "fs";
import assert from "assert";
import linkLocalDeps from "../src/link-local-deps";

test("should work", () => {
  const projectPath = path.resolve(__dirname, "./test-project");
  const packageJsonPath = path.resolve(projectPath, "./package.json");
  const packageJson = {
    localDependencies: {
      packageA: "./packageA",
      packageB: "./packageB"
    }
  };
  fs.mkdirSync(projectPath);
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
  fs.mkdirSync(
    path.resolve(projectPath, packageJson.localDependencies.packageA)
  );
  fs.mkdirSync(
    path.resolve(projectPath, packageJson.localDependencies.packageB)
  );
  fs.writeFileSync(
    path.resolve(
      projectPath,
      packageJson.localDependencies.packageA,
      "./entity"
    ),
    "packageA"
  );
  fs.writeFileSync(
    path.resolve(
      projectPath,
      packageJson.localDependencies.packageB,
      "./entity"
    ),
    "packageB"
  );

  linkLocalDeps(projectPath);

  const entityInPackageA = fs.readFileSync(
    path.resolve(
      projectPath,
      "./node_modules",
      packageJson.localDependencies.packageA,
      "./entity"
    )
  );
  const entityInPackageB = fs.readFileSync(
    path.resolve(
      projectPath,
      "./node_modules",
      packageJson.localDependencies.packageB,
      "./entity"
    )
  );
  (fs as any).rmdirSync(projectPath, { recursive: true });

  assert(entityInPackageA.toString() === "packageA");
  assert(entityInPackageB.toString() === "packageB");
});
