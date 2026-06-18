# Mac Mini Handoff - Donghaeng Room

Latest continuation note: `docs/MAC_HANDOFF_2026-06-18.md`

Important 2026-06-18 update:

- Public beta is currently blocked by Supabase Auth email/phone login friction.
- Do not spend the next Mac session on SMTP first.
- First restore local testability with fresh confirmed Supabase test users.
- Then run the local 1-leader/1-member MVP loop.
- Return to public Vercel/mobile testing only after the local loop works.

Last updated: 2026-06-16

## Start Here

Open this file first on the Mac mini.

The goal is not to build a big Christian app.
The goal is to make one small group leader say:

> "I want to use this again next week."

Keep Donghaeng Room focused on:

- daily small group faith check-in
- prayer request cards with privacy controls
- "기도했어요" reaction and prayer memory
- care-oriented leader dashboard
- lightweight Korean small group workflow

Do not add chat, feeds, Bible content, devotional media, push notifications, payment, native app work, analytics suites, or church admin features before the first real beta proof.

## Repository

GitHub repo:

```text
https://github.com/siyang0616-maker/Christian_App_project.git
```

Before switching to the Mac mini, make sure the Windows machine has pushed the latest commits.

Current Windows check before this handoff file was created:

```text
main...origin/main [ahead 1]
```

That means the Mac mini will miss recent work unless Windows pushes again.

## Public Beta URLs

Production app:

```text
https://christian-app-project.vercel.app
```

Supabase project ref:

```text
vguvxpvysodugauaxfxz
```

Supabase project root URL:

```text
https://vguvxpvysodugauaxfxz.supabase.co
```

Do not use:

```text
https://vguvxpvysodugauaxfxz.supabase.co/rest/v1/
```

Do not put `service_role` keys in Vercel or `.env.local`.

## Mac Mini Setup

Clone with GitHub Desktop or Terminal.

Terminal option:

```bash
git clone https://github.com/siyang0616-maker/Christian_App_project.git
cd Christian_App_project
corepack enable
corepack pnpm install
```

Create `.env.local`:

```bash
cp .env.example .env.local
```

Fill `.env.local` with:

```text
NEXT_PUBLIC_SUPABASE_URL=https://vguvxpvysodugauaxfxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy the anon public key from Supabase, not service_role>
NEXT_PUBLIC_SITE_URL=https://christian-app-project.vercel.app
```

Run locally:

```bash
corepack pnpm dev
```

Open:

```text
http://localhost:3000
```

Verify before pushing:

```bash
corepack pnpm verify
```

## Current Product State

Implemented:

- Email/password auth with Supabase
- Profile creation and profile display-name editing
- Group creation
- Invite code join flow
- Public beta deployment via Vercel
- Supabase RLS schema and repair SQL
- Check-in form
- Prayer request form
- Prayer request cards
- "기도했어요" reaction
- Leader dashboard
- Leader invite card with copy-ready Korean invite message
- Local/public invite distinction so `127.0.0.1` is not sent as a real beta link
- Save feedback for check-ins and prayer requests

Recent UX fixes:

- Check-in submit button now shows a saving state.
- Check-in success now shows a success message.
- Prayer submit button now shows a saving state.
- Prayer success now shows a success message and moves to the prayer card area.
- Login error for unconfirmed email is now clearer.
- Signup errors are split into setup, disabled email signup, rate limit, and generic failure categories.

## Current Deployment State To Recheck

Vercel:

- Project: `christian-app-project`
- Production URL: `https://christian-app-project.vercel.app`
- Environment variables should exist in Production:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL`

Supabase Auth:

- Site URL should be:

```text
https://christian-app-project.vercel.app
```

- Redirect URLs should include:

```text
https://christian-app-project.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3010/auth/callback
http://127.0.0.1:3010/auth/callback
```

## What Was Still Unclear / Needs Testing

1. New user signup creates the user, but login may fail until the confirmation email is clicked.
2. Need confirm whether Supabase confirmation emails arrive reliably for Naver/Gmail test accounts.
3. Need verify from a real phone that email confirmation returns to the Vercel app.
4. Need verify that saved check-ins are visibly reflected in the top status card.
5. Need verify that saved prayer requests immediately appear in the prayer card list.
6. Need verify invite message copy works on mobile browsers.
7. Need verify invite link shows the Vercel URL, not `127.0.0.1`.

## Next Work Queue

### 1. Push Windows Work To GitHub

Before Mac work starts, push the latest Windows commits.

Use GitHub Desktop:

1. Open repo `Christian_App_project`.
2. Confirm changed files include this handoff file if uncommitted.
3. Commit with a message like:

```text
handoff for mac mini beta testing
```

4. Push to `origin/main`.

On Mac, pull the latest `main`.

### 2. Run The Public Beta Smoke Test

Use `https://christian-app-project.vercel.app`, not localhost.

Test:

1. Open in phone browser or private desktop window.
2. Create a new account with a fresh email.
3. Confirm email.
4. Log in.
5. Create profile.
6. Create group.
7. Create today's check-in.
8. Confirm the success message appears.
9. Confirm the top status card updates.
10. Create a prayer request.
11. Confirm the success message appears.
12. Confirm the prayer card appears.
13. Copy invite message.
14. Open invite link as a second user.
15. Join with invite code.

### 3. Fix Email Confirmation Friction If Needed

If beta users do not receive confirmation emails:

- Check Supabase Authentication logs.
- Check Supabase email provider settings.
- For very early internal testing only, consider temporarily disabling email confirmation.
- For real beta, keep confirmation if emails are reliable.

Do not add Kakao login yet unless email signup becomes the main blocker for real leaders.

### 4. Improve User Feedback Only Where It Blocks Beta

Allowed:

- clearer success/error messages
- better loading states
- clearer empty states
- privacy copy clarity

Avoid:

- chat
- group board/feed
- Bible content
- AI prayer/devotional generation
- push notifications
- analytics dashboards
- scoring/streaks/rankings

### 5. Prepare First Real Leader Test

Target:

- 1 trusted Korean small group leader
- 1-2 members first, not 10-20 immediately

Ask the leader to complete only:

1. Make a room.
2. Send invite message.
3. Leave one check-in.
4. Leave one prayer request.
5. Check the leader dashboard once.

Success signal:

> "I want to use this again next week."

## Useful Files

- `AGENTS.md`: product operating rules and differentiation loop
- `README.md`: setup and project overview
- `docs/BETA_DEPLOYMENT.md`: Vercel/Supabase deployment checklist
- `docs/BETA_TEST_GUIDE.md`: leader/member beta flow
- `docs/COMPETITOR_DIFFERENTIATION.md`: what not to compete with
- `docs/CROSS_PLATFORM_SETUP.md`: Windows/macOS setup
- `supabase/schema.sql`: full schema reference
- `supabase/repair_after_partial_schema.sql`: repair SQL used after partial SQL execution

## Last Known Validation

After the latest UX feedback changes:

```bash
corepack pnpm verify
```

passed locally on Windows.

## First Mac Mini Command Sequence

```bash
git clone https://github.com/siyang0616-maker/Christian_App_project.git
cd Christian_App_project
corepack enable
corepack pnpm install
cp .env.example .env.local
corepack pnpm verify
corepack pnpm dev
```

Then open:

```text
http://localhost:3000
```

For real beta testing, use:

```text
https://christian-app-project.vercel.app
```
