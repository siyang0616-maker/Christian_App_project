# Donghaeng Room Beta Deployment

## Why This Matters Now

External beta testing cannot use `127.0.0.1`, `localhost`, or a local network address.

`127.0.0.1` means "this device itself." If a member opens that link on a phone, the phone looks for Donghaeng Room inside the phone, not on the developer's computer.

For a 3-5 leader beta, public deployment is therefore a must-have stabilization task, not a later feature expansion.

## Recommended MVP Path

Use:

- Vercel for the Next.js app
- The existing Supabase project for Auth, Postgres, and RLS
- A `vercel.app` URL for the first beta
- No custom domain until at least one leader says, "I want to use this again next week."

Do not add:

- native app packaging
- push notifications
- custom domain work
- payment
- analytics suites
- chat or feed features

## Deployment Checklist

### 1. Verify Locally

```bash
corepack pnpm verify
```

This must pass before pushing or deploying.

### 2. Push To GitHub

Use GitHub Desktop or git to push the latest source.

Do not commit:

- `.env.local`
- `.next/`
- `.next-dev/`
- `node_modules/`
- `*.log`

### 3. Import The GitHub Repo Into Vercel

In Vercel:

1. Create a new project.
2. Import the Donghaeng Room GitHub repo.
3. Keep the framework as Next.js.
4. Use the default build settings unless Vercel asks for commands.

If commands are needed:

```text
Install Command: corepack pnpm install
Build Command: corepack pnpm build
```

### 4. Add Vercel Environment Variables

Add these in Vercel Project Settings > Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://your-vercel-beta-url.vercel.app
```

Use the same Supabase values from local `.env.local`, but never add a Supabase `service_role` key.

`NEXT_PUBLIC_SUPABASE_URL` must be the project root URL:

```text
https://your-project-ref.supabase.co
```

Do not include the REST API suffix:

```text
https://your-project-ref.supabase.co/rest/v1/
```

After changing environment variables, redeploy. Environment variable changes do not update old deployments automatically.

### 5. Configure Supabase Auth Redirects

In Supabase Dashboard > Authentication > URL Configuration:

Set Site URL:

```text
https://your-vercel-beta-url.vercel.app
```

Add Redirect URLs:

```text
https://your-vercel-beta-url.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3010/auth/callback
http://127.0.0.1:3010/auth/callback
```

For Vercel preview deployments, Supabase supports wildcard redirect URLs, but for the production beta URL prefer the exact callback path.

### 6. Test The Public Beta Link

Open the deployed URL on a phone that is not connected to your development machine.

Test:

1. New user signs up.
2. Email confirmation returns to the public beta app.
3. User creates profile.
4. User creates a group.
5. Invite card shows a public `https://...vercel.app` link, not `127.0.0.1`.
6. Copy code, copy link, and copy message work.
7. A second user joins with the invite code.

## Invite Link Behavior

In local development:

- The invite card warns that the current link is local.
- Link copy is disabled because it would not work for external members.
- Code copy and message copy still work.

After public deployment:

- The invite card uses `NEXT_PUBLIC_SITE_URL`.
- The invite link includes the invite code as a query string.
- Members still see the invite code in the message in case signup/login loses the query string.

## Priority Decision

Do this before inviting real members.

The next highest priority after deployment is not a new feature. It is one external manual test:

1. Leader creates a room on the public beta link.
2. Leader sends the copy-ready message to one trusted member.
3. Member joins and creates one check-in.
4. Leader confirms the check-in appears without feeling like surveillance.

That is the first real beta proof.

## Official References

- Vercel Git deployments: https://vercel.com/docs/git
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Supabase redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
