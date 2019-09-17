import path from "path";
import fs from "fs";

interface PackageJson {
  localDependencies?: {
    [name: string]: string;
  };
}

export default function(projectPath: string) {
  const packageJsonPath = path.join(projectPath, "./package.json");
  const nodeModulesPath = path.resolve(projectPath, "./node_modules");

  const packageJsonBuffer = fs.readFileSync(packageJsonPath);
  const packageJson: PackageJson = JSON.parse(packageJsonBuffer.toString());
  const { localDependencies } = packageJson;
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
    console.log("symlink", distPath, "->", srcPath);
  }
}
