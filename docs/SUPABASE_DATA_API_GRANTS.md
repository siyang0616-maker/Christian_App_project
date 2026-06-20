# Supabase Data API Grants

## Purpose

If profile save fails right after login with:

- `프로필을 저장하지 못했어요`

the database may have RLS policies but may not be exposed to the Supabase Data API for authenticated users.

Supabase projects created after the 2026 Data API exposure change may require explicit `grant` statements for public tables.

## Fix

Run this SQL once in Supabase SQL Editor:

```text
supabase/migrations/005_data_api_grants.sql
```

## Why This Is Safe

The grant opens the Data API path for logged-in users, but RLS still controls which rows they can read or write.

This does not add new app features, paid services, storage, AI, push, chat, or church ERP behavior.

## After Running

1. Return to `https://christian-app-project.vercel.app/`.
2. Log in as the leader test user.
3. Save the profile name again.
4. Continue the 1 leader + 2 members smoke test in `docs/QA_CHECKLIST.md`.

## If Profile Save Still Fails

Run this SQL file in the Supabase SQL Editor for the same project that Vercel uses:

```text
supabase/diagnostics/profile_save_diagnostics.sql
```

The most important row is `profiles`.

Expected values:

- `table_exists`: `true`
- `rls_enabled`: `true`
- `authenticated_select`: `true`
- `authenticated_insert`: `true`
- `authenticated_update`: `true`
- `authenticated_delete`: `true`

If any of these are `false`, run `supabase/migrations/005_data_api_grants.sql` again in that same Supabase project.

If all of them are `true` and profile save still fails, check Vercel logs for:

```text
Supabase profile save failed
```

That log line should show the Supabase `code`, `message`, `details`, and `hint` without exposing private data to app users.
