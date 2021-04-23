import path from "path";
import fs from "fs";
import linkLocalDeps from "../src/link-local-deps";
import os from "os";
import { execSync } from "child_process";

const projectPath = path.resolve(os.tmpdir(), "./test-project2");

const packageJsonPath = path.resolve(projectPath, "./package.json");

const packageJson = {
  localDependencies: {
    packageA: "./packageA",
  },
};

const aPackageJson = {
  name: "packageA",
  scripts: {
    "local:postinstall": "echo done > build",
  },
};

const packageAPath = path.resolve(
  projectPath,
  packageJson.localDependencies.packageA
);

afterAll(() => {
  fs.rmSync(projectPath, { recursive: true });
});

test("run scripts.local:postinstall", () => {
  // setup project
  fs.mkdirSync(projectPath);
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson));
  fs.mkdirSync(packageAPath);
  fs.writeFileSync(
    path.join(packageAPath, "package.json"),
    JSON.stringify(aPackageJson)
  );

  linkLocalDeps(projectPath);

  const buildFile = fs.readFileSync(path.join(packageAPath, "build"), "utf-8");
  expect(buildFile).toBe("done\n");
});
