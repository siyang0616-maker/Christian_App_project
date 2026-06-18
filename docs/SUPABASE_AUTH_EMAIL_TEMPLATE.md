# Supabase Auth Email Template

Purpose: make password reset links work more reliably on mobile email apps during beta testing.

## Why This Exists

Supabase default password reset emails use `{{ .ConfirmationURL }}`.

Some email apps and security scanners can open that URL before the user taps it. Because Supabase reset links are one-time links, this can make the app show:

> 재설정 링크를 확인할 수 없어요

For Donghaeng Room beta, use a `TokenHash` link that opens our app first. The app then waits for the user to tap a confirmation button before verifying the recovery token.

## Where To Change It

Supabase Dashboard:

1. Open the DonghaengBang project.
2. Go to `Authentication`.
3. Go to `Emails`.
4. Open the `Reset Password` template.
5. Replace the email body/source with the template below.
6. Save.

## Reset Password Template

Use this for the `Reset Password` email body:

```html
<h2>동행방 비밀번호 재설정</h2>

<p>동행방 비밀번호를 다시 설정하려면 아래 버튼을 눌러 주세요.</p>

<p>
  <a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">
    비밀번호 재설정하기
  </a>
</p>

<p>요청한 적이 없다면 이 메일은 무시하셔도 됩니다.</p>
```

## Required App URL Settings

Supabase `Authentication > URL Configuration` should include:

- Site URL: `https://christian-app-project.vercel.app`
- Redirect URL: `https://christian-app-project.vercel.app/auth/reset-password`
- Redirect URL for local testing: `http://127.0.0.1:3010/auth/reset-password`
- Redirect URL for local testing: `http://localhost:3010/auth/reset-password`

## Important Notes

- Do not use `service_role` keys in Vercel or client code.
- The current beta still uses the public anon key and RLS.
- Old reset emails that were already sent may still fail. Send a new reset email after saving this template.
- Supabase default email sending can be rate limited. If reset emails stop sending, wait before requesting another one.
