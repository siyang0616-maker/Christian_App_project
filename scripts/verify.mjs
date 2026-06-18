import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const checks = ["lint", "typecheck", "build"];

function runNodeScript(scriptPath) {
  return spawnSync(process.execPath, [scriptPath], {
    stdio: "inherit",
    shell: false,
  });
}

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

console.log("\n> verify:auth-form-regression");
const authFormRegression = runNodeScript("scripts/check-auth-form-regression.mjs");

if (authFormRegression.status !== 0) {
  process.exit(authFormRegression.status ?? 1);
}

console.log("\n> verify:password-recovery-regression");
const passwordRecoveryRegression = runNodeScript("scripts/check-password-recovery-regression.mjs");

if (passwordRecoveryRegression.status !== 0) {
  process.exit(passwordRecoveryRegression.status ?? 1);
}

console.log("\n> verify:action-feedback-regression");
const actionFeedbackRegression = runNodeScript("scripts/check-action-feedback-regression.mjs");

if (actionFeedbackRegression.status !== 0) {
  process.exit(actionFeedbackRegression.status ?? 1);
}

for (const check of checks) {
  console.log(`\n> verify:${check}`);
  const result = runPackageScript(check);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\nAll verification checks passed.");
