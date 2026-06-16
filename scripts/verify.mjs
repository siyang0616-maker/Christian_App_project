import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const checks = ["lint", "typecheck", "build"];

function runPackageScript(scriptName) {
  const packageManagerCli = process.env.npm_execpath;

  if (packageManagerCli && existsSync(packageManagerCli)) {
    return spawnSync(process.execPath, [packageManagerCli, "run", scriptName], {
      stdio: "inherit",
      shell: false,
    });
  }

  const corepack = process.platform === "win32" ? "corepack.cmd" : "corepack";

  return spawnSync(corepack, ["pnpm", "run", scriptName], {
    stdio: "inherit",
    shell: false,
  });
}

for (const check of checks) {
  console.log(`\n> verify:${check}`);
  const result = runPackageScript(check);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\nAll verification checks passed.");

