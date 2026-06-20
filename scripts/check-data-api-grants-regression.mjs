import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const schemaSource = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const repairSource = readFileSync(new URL("../supabase/repair_after_partial_schema.sql", import.meta.url), "utf8");
const grantsMigrationSource = readFileSync(
  new URL("../supabase/migrations/005_data_api_grants.sql", import.meta.url),
  "utf8",
);

const requiredTables = [
  "profiles",
  "groups",
  "group_members",
  "checkins",
  "prayers",
  "prayer_reactions",
  "leader_prayer_care_marks",
];

function assertDataApiGrants(source, label) {
  assert.match(source, /grant usage on schema public to authenticated;/, `${label} should grant schema usage.`);

  requiredTables.forEach((table) => {
    assert.match(
      source,
      new RegExp(`grant select, insert, update, delete on table public\\.${table} to authenticated;`),
      `${label} should expose public.${table} to authenticated users through the Data API while RLS controls rows.`,
    );
  });

  assert.match(
    source,
    /grant execute on function public\.join_group_by_code\(text\) to authenticated;/,
    `${label} should allow authenticated users to join by invite code through the RPC.`,
  );
}

assertDataApiGrants(schemaSource, "schema.sql");
assertDataApiGrants(repairSource, "repair SQL");
assertDataApiGrants(grantsMigrationSource, "005 grants migration");

console.log("Data API grant regression checks passed.");
