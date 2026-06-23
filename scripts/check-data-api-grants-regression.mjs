import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const schemaSource = readFileSync(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const repairSource = readFileSync(new URL("../supabase/repair_after_partial_schema.sql", import.meta.url), "utf8");
const grantsMigrationSource = readFileSync(
  new URL("../supabase/migrations/005_data_api_grants.sql", import.meta.url),
  "utf8",
);
const createGroupRpcMigrationUrl = new URL("../supabase/migrations/006_create_group_with_leader_rpc.sql", import.meta.url);

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

assert.ok(existsSync(createGroupRpcMigrationUrl), "A migration should define create_group_with_leader for atomic group creation.");

const createGroupRpcMigrationSource = readFileSync(createGroupRpcMigrationUrl, "utf8");

assert.match(
  createGroupRpcMigrationSource,
  /create or replace function public\.create_group_with_leader\(group_name text\)/,
  "The group creation RPC migration should define public.create_group_with_leader(group_name text).",
);

assert.match(
  createGroupRpcMigrationSource,
  /insert into public\.groups[\s\S]*insert into public\.group_members/,
  "The group creation RPC should create the group and leader membership in one database function.",
);

assert.match(
  createGroupRpcMigrationSource,
  /grant execute on function public\.create_group_with_leader\(text\) to authenticated;/,
  "Authenticated users should be able to call create_group_with_leader through Supabase RPC.",
);

console.log("Data API grant regression checks passed.");
