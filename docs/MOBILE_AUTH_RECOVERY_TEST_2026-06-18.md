# Mobile Auth Recovery Test - 2026-06-18

## Purpose

Get Donghaeng Room working on a real phone browser before sending the beta link to testers.

This is not a feature expansion task. It is a pre-beta stabilization task for authentication and mobile access.

## Product Reminder

The goal is not to build a big Christian app.
The goal is to make one small group leader say:

> "I want to use this again next week."

Mobile login and password recovery must work because a leader/member cannot test the MVP if they cannot enter the room.

## What Happened Yesterday

- Public Vercel URL was deployed:
  - `https://christian-app-project.vercel.app`
- Supabase environment variables were corrected:
  - `NEXT_PUBLIC_SUPABASE_URL` must be the project root URL, without `/rest/v1`.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` is allowed.
  - `service_role` must not be added to Vercel or public app code.
- Supabase Auth redirect URLs were configured for local and production callback URLs.
- Phone Safari login kept failing.
- Vercel logs showed:
  - `code: invalid_credentials`
  - `message: Invalid login credentials`
- Supabase `Last sign in at` changed when logging in from desktop, but did not change when login failed on phone.
- This confirmed the phone failure was not a cookie/session problem. Supabase was rejecting the email/password combination.
- Password recovery email returned to the app root with a recovery token in the URL hash, but the app had no password reset screen.
- Later testing showed another failure mode:
  - Vercel received phone login attempts.
  - Supabase returned `invalid_credentials`.
  - Repeated password recovery requests returned `over_email_send_rate_limit` / HTTP 429.
  - A reset email could open `/auth/reset-password`, but the app could show `재설정 링크를 확인할 수 없어요`.
  - This can happen when the default Supabase `{{ .ConfirmationURL }}` link is consumed early by email prefetching/security scanning, or when PKCE code exchange is opened in a different browser/device than the one that requested the email.

## What Was Fixed

Added password recovery handling:

- `components/auth-recovery-router.tsx`
  - Detects Supabase recovery links that return to `/#access_token=...&type=recovery`.
  - Redirects them to `/auth/reset-password` while preserving the hash.
- `app/auth/reset-password/page.tsx`
  - New password reset page.
- `components/password-reset-form.tsx`
  - Reads the recovery token in the browser.
  - Supports `token_hash` recovery links from a custom Supabase email template.
  - Waits for the user to tap `비밀번호 재설정 계속하기` before verifying the recovery token.
  - Sets the Supabase session from the recovery token.
  - Allows the user to enter and confirm a new password.
  - Updates the Supabase password.
  - Signs the user out and returns to the login screen.
- `lib/auth/password-recovery.ts`
  - Small helper for parsing Supabase recovery hash tokens and `token_hash` recovery links.
- `lib/supabase/browser.ts`
  - Browser Supabase client for client-side recovery flow.
- `app/page.tsx`
  - Added success notice after password reset:
    - `/?notice=password-updated`
- `docs/SUPABASE_AUTH_EMAIL_TEMPLATE.md`
  - Documents the required Supabase Reset Password email template.
  - The template uses `{{ .TokenHash }}` instead of the default `{{ .ConfirmationURL }}`.

## Verification Completed

Local verification passed:

```powershell
corepack pnpm verify
```

Passed:

- lint
- typecheck
- build

Public Vercel check:

- `https://christian-app-project.vercel.app/auth/reset-password`
- Status: `200`

Git state checked:

- Branch: `main`
- Latest commit:
  - `556f95c safari에서 로그인 안되서 체크중`
- Local branch and `origin/main` are aligned.

## What To Do Now On Phone

Use a phone browser, preferably Safari first.

### Step 0. Update The Supabase Reset Password Email Template

Before sending a new reset email, follow:

- `docs/SUPABASE_AUTH_EMAIL_TEMPLATE.md`

This is required because old/default Supabase reset emails may be consumed before the user taps them.

### Step 1. Send a New Password Recovery Email

In Supabase:

1. Go to `Authentication`.
2. Go to `Users`.
3. Click the test user email.
4. Click `Send password recovery`.

Use a fresh recovery email because old recovery links may be expired or already consumed.

If Vercel logs show `over_email_send_rate_limit`, wait before requesting another email. Supabase may temporarily limit reset emails.

### Step 2. Open The Email On The Phone

On the phone:

1. Open the password recovery email.
2. Tap `Reset password`.
3. Expected result:
   - The app should open.
   - It should show `비밀번호를 새로 설정해요`.
   - It may first show `재설정 링크를 찾았어요`.
   - Tap `비밀번호 재설정 계속하기`.

If it goes to the normal home screen instead, the recovery hash routing still failed.

### Step 3. Set A Simple Test Password

For testing only, avoid special characters first.

Use an English letters + numbers password.

Do not paste passwords into ChatGPT or Codex.

### Step 4. Confirm Login On Phone

After saving the new password:

1. The app should return to the login screen.
2. Log in with the same email and new password.
3. In Supabase `Authentication > Users`, check `Last sign in at`.

Expected:

- `Last sign in at` updates.
- Phone enters Donghaeng Room.

## If It Still Fails

### Case A. `Last sign in at` does not change

Meaning:

- Supabase still rejected the email/password.

Check Vercel logs for:

```txt
Supabase login failed
```

Likely code:

```txt
invalid_credentials
```

Next action:

- Reset password again with a simple English/number password.
- Type it manually on phone.
- Avoid saved passwords and keyboard substitutions.

### Case B. `Last sign in at` changes, but the app still shows login

Meaning:

- Supabase accepted the login, but app session/cookie handling may be failing.

Next action:

- Test Safari private mode.
- Test mobile Chrome.
- Clear site data for `christian-app-project.vercel.app`.
- Check Vercel logs and Supabase Auth logs.

### Case C. Reset email opens normal home screen

Meaning:

- Recovery hash did not route to `/auth/reset-password`.

Next action:

- Confirm the public route opens:
  - `https://christian-app-project.vercel.app/auth/reset-password`
- Send a fresh password recovery email.
- Confirm the email link is opening the production Vercel URL, not localhost.

### Case D. Reset page says `재설정 링크를 확인할 수 없어요`

Meaning:

- The reset link was expired, already used, consumed by email prefetching, or PKCE exchange failed across browsers/devices.

Next action:

- Update Supabase Reset Password template using `docs/SUPABASE_AUTH_EMAIL_TEMPLATE.md`.
- Send a fresh reset email after the template is saved.
- Open the newest email only once.
- If logs show `over_email_send_rate_limit`, wait before requesting another email.

## After Phone Login Works

Continue the beta smoke test:

1. Leader creates room.
2. Leader finds invite code.
3. Member joins with invite code.
4. Member submits today's check-in.
5. Member submits prayer request.
6. Another member clicks `기도했어요`.
7. Leader checks dashboard.
8. Confirm private and anonymous visibility rules.

Do not invite external beta users until this full phone flow passes.
