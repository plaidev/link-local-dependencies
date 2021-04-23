import path from "path";
import fs from "fs";
import { execSync } from "child_process";

interface PackageJson {
  localDependencies?: {
    [name: string]: string;
  };
}

const prefix = "[@plaidev/link-local-dependencies]";

export default function (projectPath: string) {
  const packageJsonPath = path.join(projectPath, "./package.json");
  const nodeModulesPath = path.resolve(projectPath, "./node_modules");

  const pkgStr = fs.readFileSync(packageJsonPath, "utf-8");
  const { localDependencies } = JSON.parse(pkgStr) as PackageJson;

  if (!localDependencies) {
    console.log("no local dependencies");
    return;
  }

  for (const name of Object.keys(localDependencies)) {
    const distPath = path.resolve(nodeModulesPath, name);
    const srcPath = path.relative(
      path.dirname(distPath),
      path.resolve(projectPath, localDependencies[name])
    );
    fs.mkdirSync(path.dirname(distPath), { recursive: true });

    try {
      fs.unlinkSync(distPath);
    } catch (e) {}
    fs.symlinkSync(srcPath, distPath);

    try {
      const distPkg = JSON.parse(
        fs.readFileSync(path.join(distPath, "package.json"), "utf-8")
      );
      const localPostInstallCommand = distPkg.scripts?.["local:postinstall"];
      if (localPostInstallCommand) {
        console.log(prefix, "local:postinstall -", localPostInstallCommand);
        const out = execSync("npm run local:postinstall", {
          cwd: distPath,
        });
        console.log(out.toString());
      }
    } catch (err) {}

    console.log(
      prefix,
      "symlink",
      distPath.replace(projectPath + "/", ""),
      "->",
      srcPath
    );
  }
}
