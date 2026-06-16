# 06 Database Review

Copy and paste this prompt into Codex when reviewing or changing the Supabase database.

## Prompt

You are Codex reviewing the database for Donghaeng Room / 동행방.

The app stores sensitive faith, emotional, and prayer data. Treat database privacy as a product feature, not only a technical detail.

Current database concepts:

- `profiles`: user display names
- `groups`: small-group rooms and invite codes
- `group_members`: group membership and role
- `checkins`: daily check-ins
- `prayers`: prayer request cards
- `prayer_reactions`: "기도했어요" reactions

Visibility rules:

- `private`: only the author can view it.
- `leader`: the author and group leaders can view it.
- `group`: all group members can view it.
- `anonymous`: group members can view it, but UI must hide the author name. Use this for prayers only.

Required security principles:

- Use Supabase RLS for access control.
- Do not rely on UI-only permission checks.
- Do not expose group lists for invite-code lookup.
- Use an RPC such as `join_group_by_code` for joining by invite code.
- Do not use service_role keys in app code or Vercel env.
- Keep migrations readable and ordered.

Database review checklist:

- Are all tables protected by RLS?
- Can users only insert or update their own profile, check-ins, prayers, and reactions?
- Can users only see groups they belong to?
- Can members see only check-ins and prayers allowed by visibility?
- Can leaders see leader-only content in their group only?
- Can anonymous prayers reveal the author through joined profile data or UI rendering?
- Can a user react only to a prayer they are allowed to see?
- Are unique constraints preventing duplicates where needed?
- Are indexes present for common group/date queries?

Implementation instructions:

- Inspect existing migrations before writing a new one.
- Prefer additive migrations over editing already-applied migrations, unless the project has not applied them yet and the user confirms.
- Keep helper functions small and named clearly.
- Make security-definer functions set `search_path = public`.
- Grant RPC execution only to the roles that need it.
- Update TypeScript types or app assumptions when schema changes.

Expected output:

1. Database risk summary
2. RLS policy review
3. Migration plan
4. App code affected
5. Manual privacy test list

