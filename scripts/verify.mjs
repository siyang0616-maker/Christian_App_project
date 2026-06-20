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

console.log("\n> verify:prayer-draft-regression");
const prayerDraftRegression = runNodeScript("scripts/check-prayer-draft-regression.mjs");

if (prayerDraftRegression.status !== 0) {
  process.exit(prayerDraftRegression.status ?? 1);
}

console.log("\n> verify:dashboard-data-regression");
const dashboardDataRegression = runNodeScript("scripts/check-dashboard-data-regression.mjs");

if (dashboardDataRegression.status !== 0) {
  process.exit(dashboardDataRegression.status ?? 1);
}

console.log("\n> verify:leader-care-board-regression");
const leaderCareBoardRegression = runNodeScript("scripts/check-leader-care-board-regression.mjs");

if (leaderCareBoardRegression.status !== 0) {
  process.exit(leaderCareBoardRegression.status ?? 1);
}

console.log("\n> verify:test-user-helper-regression");
const testUserHelperRegression = runNodeScript("scripts/check-test-user-helper-regression.mjs");

if (testUserHelperRegression.status !== 0) {
  process.exit(testUserHelperRegression.status ?? 1);
}

console.log("\n> verify:data-api-grants-regression");
const dataApiGrantsRegression = runNodeScript("scripts/check-data-api-grants-regression.mjs");

if (dataApiGrantsRegression.status !== 0) {
  process.exit(dataApiGrantsRegression.status ?? 1);
}

console.log("\n> verify:profile-save-diagnostics-regression");
const profileSaveDiagnosticsRegression = runNodeScript("scripts/check-profile-save-diagnostics-regression.mjs");

if (profileSaveDiagnosticsRegression.status !== 0) {
  process.exit(profileSaveDiagnosticsRegression.status ?? 1);
}

console.log("\n> verify:beta-quality-copy-regression");
const betaQualityCopyRegression = runNodeScript("scripts/check-beta-quality-copy-regression.mjs");

if (betaQualityCopyRegression.status !== 0) {
  process.exit(betaQualityCopyRegression.status ?? 1);
}

for (const check of checks) {
  console.log(`\n> verify:${check}`);
  const result = runPackageScript(check);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\nAll verification checks passed.");
