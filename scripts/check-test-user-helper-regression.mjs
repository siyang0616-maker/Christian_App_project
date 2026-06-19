import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const helperSource = readFileSync(new URL("./create-confirmed-test-users.mjs", import.meta.url), "utf8");
const powershellWrapperSource = readFileSync(new URL("./create-confirmed-test-users.ps1", import.meta.url), "utf8");

assert.match(
  helperSource,
  /SUPABASE_SERVICE_ROLE_KEY/,
  "Confirmed test user helper should require a server-only service role key.",
);

assert.doesNotMatch(
  helperSource,
  /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY|NEXT_PUBLIC_SUPABASE_SECRET_KEY/,
  "Confirmed test user helper must never ask for a public service role key.",
);

assert.match(
  helperSource,
  /auth\.admin\.createUser\([\s\S]*email_confirm:\s*true/,
  "Confirmed test user helper should auto-confirm test user emails through the Auth admin API.",
);

assert.match(
  helperSource,
  /signInWithPassword/,
  "Confirmed test user helper should verify the created users can sign in.",
);

assert.match(
  helperSource,
  /service_role[\s\S]*server-only/i,
  "Confirmed test user helper should explain that the service role key is server-only.",
);

assert.match(
  powershellWrapperSource,
  /Read-Host[\s\S]*-AsSecureString/,
  "Windows wrapper should prompt for the service role key without echoing it.",
);

assert.match(
  powershellWrapperSource,
  /Remove-Item Env:\\SUPABASE_SERVICE_ROLE_KEY/,
  "Windows wrapper should remove the service role key from the process environment after running.",
);

console.log("Confirmed test user helper regression checks passed.");
