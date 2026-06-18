# Mac Handoff - 2026-06-18

## Read This First

Do not spend the next Mac session on SMTP setup first.

The current product goal is still:

> The goal is not to build a big Christian app. The goal is to make one small group leader say: "I want to use this again next week."

The immediate job is to make the MVP testable again, not to add new features.

## Current Status

- Public beta is not ready.
- The app code is still focused on the MVP wedge: check-in, prayer memory, and leader care.
- The latest Windows work improved user-facing save feedback for check-ins and prayers.
- `corepack pnpm verify` passed on Windows after the feedback patch.
- Local `http://127.0.0.1:3010` returned HTTP 200 after restarting the dev server.

## What Changed Before This Handoff

- Check-in success/failure feedback now appears near the check-in status area instead of being easy to miss.
- Prayer save/reaction feedback now appears inside the prayer cards area.
- Added a regression check:
  - `scripts/check-action-feedback-regression.mjs`
- Wired that regression check into:
  - `scripts/verify.mjs`
- Updated work notes in:
  - `docs/WORKLOG.md`

## Current Blocker

Supabase Auth email flow is blocking phone/public testing.

Observed during the Windows session:

- Phone Safari reached the public Vercel app, but login attempts failed with Supabase `invalid_credentials`.
- Password recovery requests hit Supabase email rate limiting: `over_email_send_rate_limit` / HTTP 429.
- Supabase dashboard could not save the `Confirm email` toggle because it showed `Failed to update settings: Failed to fetch (api.supabase.com)`.
- Custom SMTP setup was not completed and should not block product work.
- During troubleshooting, the Supabase Auth users were deleted. At handoff time, do not assume any previous test user still exists.

## What To Do First On Mac

1. Pull the latest GitHub state.

```bash
git clone https://github.com/siyang0616-maker/Christian_App_project.git
cd Christian_App_project
```

If the repo already exists:

```bash
git pull
```

2. Install and verify.

```bash
corepack enable
corepack pnpm install
corepack pnpm verify
```

3. Create `.env.local` if it is missing.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vguvxpvysodugauaxfxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=copy_the_public_anon_key_from_supabase_or_vercel
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3010
```

Do not put a `service_role` key in `.env.local` for client/server-action MVP work, and never put it in any `NEXT_PUBLIC_` variable.

4. Start the local app.

```bash
corepack pnpm dev -- --hostname 127.0.0.1 --port 3010
```

Open:

- `http://127.0.0.1:3010`

If port `3010` is busy, use another port and update `NEXT_PUBLIC_SITE_URL` for that local session.

## Recommended Next Work Order

### P0 - Recover Local Testability

1. Create fresh confirmed test users.
   - Preferred: Supabase Dashboard -> Authentication -> Users -> Add user.
   - Create one leader and one member with known passwords.
   - If the dashboard offers an auto-confirm option, use it.
   - If auto-confirm is not available and email confirmation still blocks testing, use a carefully scoped SQL confirmation only for your own test accounts.

2. Test the local MVP loop with one leader.
   - Login.
   - Create profile.
   - Create a room.
   - Confirm the creator becomes leader.
   - Copy the invite code/message.

3. Test one member.
   - Login.
   - Join with invite code.
   - Submit one check-in.
   - Submit one prayer request.
   - Confirm the check-in and prayer feedback is visible immediately.

4. Only after local flow works, return to public Vercel/mobile testing.

### P1 - Public Test Recovery

1. Deploy the latest code to Vercel.
2. Confirm Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` should be the base Supabase URL, not `/rest/v1`.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be the public anon key.
   - `NEXT_PUBLIC_SITE_URL` should be `https://christian-app-project.vercel.app`.
3. In Supabase Auth URL settings, keep:
   - Site URL: `https://christian-app-project.vercel.app`
   - Redirect URL: `https://christian-app-project.vercel.app/auth/callback`
   - Local redirect URL only for development.
4. Run phone Safari test again with a fresh confirmed user.

### P2 - Beta Gate

Run the 1-leader/2-member smoke test from `docs/QA_CHECKLIST.md`.

Do not invite real beta testers until:

- Public URL opens on mobile.
- Leader can create a room without help.
- Member can join with invite code.
- Check-in feedback is clear.
- Prayer request feedback is clear.
- Private/anonymous visibility does not leak.

## Do Not Do First

- Do not keep retrying SMTP before local testability is restored.
- Do not add Kakao login yet.
- Do not add real-time chat.
- Do not add a BAND-style board/feed.
- Do not add Bible/devotional content.
- Do not add AI prayer generation.
- Do not add push notifications, payment, file upload, native app, or church ERP features.

## Files To Open First

- `docs/MAC_HANDOFF_2026-06-18.md`
- `docs/BETA_STATUS.md`
- `docs/RISK_REGISTER.md`
- `docs/WORKLOG.md`
- `docs/QA_CHECKLIST.md`
- `app/page.tsx`
- `components/check-in-form.tsx`
- `components/prayer-request-list.tsx`
- `scripts/check-action-feedback-regression.mjs`

## Current Known-Good Verification

Last verified on Windows before this handoff:

```bash
corepack pnpm verify
```

Result:

- Auth form regression passed.
- Password recovery regression passed.
- Action feedback regression passed.
- Lint passed.
- Typecheck passed.
- Build passed.

## Next Decision

If confirmed test users can complete the local MVP loop, continue product stabilization.

If even confirmed local test users cannot log in or save data, stop product UX work and debug Supabase Auth/session/RLS from code and logs before touching SMTP again.
