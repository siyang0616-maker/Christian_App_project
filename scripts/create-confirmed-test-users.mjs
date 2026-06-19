import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";

const SERVICE_ROLE_ENV = "SUPABASE_SERVICE_ROLE_KEY";
const DEFAULT_PASSWORD_PREFIX = "Donghaeng-Test";

function printHelp() {
  console.log(`Create fresh confirmed Supabase Auth users for local MVP smoke testing.

Usage:
  SUPABASE_SERVICE_ROLE_KEY=<server-only-key> node scripts/create-confirmed-test-users.mjs

Options:
  --leader-email <email>   Use a specific leader email.
  --member-email <email>   Use a specific member email.
  --password <password>    Use a specific shared test password.
  --json                   Print machine-readable output.
  --help                   Show this help.

Security:
  The service_role key is server-only. Never put it in a NEXT_PUBLIC_* variable,
  browser code, Vercel public env, screenshots, commits, or chat messages.
`);
}

function parseArgs(argv) {
  const options = { json: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--leader-email") {
      options.leaderEmail = argv[++index];
    } else if (arg === "--member-email") {
      options.memberEmail = argv[++index];
    } else if (arg === "--password") {
      options.password = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function readDotEnvLocal() {
  if (!existsSync(".env.local")) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function getPublicSupabaseEnv(dotEnv) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || dotEnv.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || dotEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return { supabaseUrl, supabaseAnonKey };
}

function getServiceRoleKey() {
  const serviceRoleKey = process.env[SERVICE_ROLE_ENV];

  if (!serviceRoleKey) {
    throw new Error(
      `Missing ${SERVICE_ROLE_ENV}. Set it for this one command only. The service_role key is server-only and must never be stored in NEXT_PUBLIC_* env.`,
    );
  }

  return serviceRoleKey;
}

function defaultCredentials(options) {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

  return {
    leaderEmail: options.leaderEmail || `donghaeng.leader+${stamp}@gmail.com`,
    memberEmail: options.memberEmail || `donghaeng.member+${stamp}@gmail.com`,
    password: options.password || `${DEFAULT_PASSWORD_PREFIX}-${stamp}!`,
  };
}

async function createConfirmedUser(adminClient, email, password) {
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw new Error(`Failed to create confirmed user ${email}: ${error.message}`);
  }

  return data.user;
}

async function verifySignIn(publicClient, email, password) {
  const { data, error } = await publicClient.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    throw new Error(`Created user ${email}, but sign-in verification failed: ${error?.message ?? "no session returned"}`);
  }

  await publicClient.auth.signOut();
}

function printResult(result, json) {
  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log("Fresh confirmed Supabase test users are ready.");
  console.log("");
  console.log(`Leader email: ${result.leader.email}`);
  console.log(`Member email: ${result.member.email}`);
  console.log(`Shared password: ${result.password}`);
  console.log("");
  console.log("Next local smoke path:");
  console.log("1. Start the app on http://127.0.0.1:3010");
  console.log("2. Log in as the leader, create a profile, create a room, and copy the invite code.");
  console.log("3. Log out, log in as the member, create a profile, join with the invite code, check in, and add a prayer request.");
  console.log("4. Log back in as the leader and confirm the dashboard shows care-oriented member activity.");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const dotEnv = readDotEnvLocal();
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseEnv(dotEnv);
  const serviceRoleKey = getServiceRoleKey();
  const credentials = defaultCredentials(options);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const publicClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const leader = await createConfirmedUser(adminClient, credentials.leaderEmail, credentials.password);
  const member = await createConfirmedUser(adminClient, credentials.memberEmail, credentials.password);

  await verifySignIn(publicClient, credentials.leaderEmail, credentials.password);
  await verifySignIn(publicClient, credentials.memberEmail, credentials.password);

  printResult(
    {
      leader: { email: credentials.leaderEmail, id: leader.id },
      member: { email: credentials.memberEmail, id: member.id },
      password: credentials.password,
    },
    options.json,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
