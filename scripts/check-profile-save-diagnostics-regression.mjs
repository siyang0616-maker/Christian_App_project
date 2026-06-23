import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const profileActionSource = readFileSync(new URL("../lib/actions/profile.ts", import.meta.url), "utf8");
const diagnosticsSource = readFileSync(
  new URL("../supabase/diagnostics/profile_save_diagnostics.sql", import.meta.url),
  "utf8",
);

assert.match(
  profileActionSource,
  /console\.error\("Supabase profile save failed"/,
  "Profile save failures should write safe server-side diagnostics for Vercel logs.",
);

assert.match(
  profileActionSource,
  /redirect\(actionErrorPath\("profile-save", returnTo\)\)/,
  "Profile save failures should keep the user-facing error safe and generic.",
);

[
  "profiles",
  "groups",
  "group_members",
  "checkins",
  "prayers",
  "prayer_reactions",
  "leader_prayer_care_marks",
].forEach((table) => {
  assert.match(
    diagnosticsSource,
    new RegExp(`\\('${table}'\\)`),
    `Diagnostics should check public.${table}.`,
  );
});

[
  "authenticated_select",
  "authenticated_insert",
  "authenticated_update",
  "authenticated_delete",
  "rls_enabled",
  "pg_policies",
  "join_group_by_code",
].forEach((requiredCheck) => {
  assert.match(diagnosticsSource, new RegExp(requiredCheck), `Diagnostics should include ${requiredCheck}.`);
});

console.log("Profile save diagnostics regression checks passed.");
