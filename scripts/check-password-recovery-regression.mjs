import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const recoverySource = readFileSync(new URL("../lib/auth/password-recovery.ts", import.meta.url), "utf8");
const resetFormSource = readFileSync(new URL("../components/password-reset-form.tsx", import.meta.url), "utf8");
const templateDocSource = readFileSync(new URL("../docs/SUPABASE_AUTH_EMAIL_TEMPLATE.md", import.meta.url), "utf8");

assert.match(
  recoverySource,
  /getRecoveryTokenHashFromSearch/,
  "Password recovery utilities should parse token_hash recovery links.",
);

assert.match(
  resetFormSource,
  /verifyOtp\(\{\s*token_hash:\s*tokenHash,\s*type:\s*"recovery"/,
  "Password reset form should verify token_hash recovery links.",
);

assert.match(
  resetFormSource,
  /state === "confirm"/,
  "Token hash recovery should wait for an explicit user confirmation step.",
);

assert.match(
  templateDocSource,
  /token_hash=\{\{ \.TokenHash \}\}&type=recovery/,
  "Supabase recovery email template should use TokenHash recovery links.",
);

assert.match(
  templateDocSource,
  /Do not use `service_role` keys/,
  "Recovery email template docs should explicitly forbid service_role keys.",
);

console.log("Password recovery regression checks passed.");
