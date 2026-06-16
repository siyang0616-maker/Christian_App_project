# Cross-Platform Setup

Donghaeng Room should run the same way on Windows and macOS.

The project uses `pnpm@9.15.4` through Corepack. Prefer `corepack pnpm` in docs and handoff notes because it works even when the `pnpm` command is not installed globally.

## Requirements

- Node.js 20 or newer
- Corepack enabled
- Git
- Supabase project credentials

Check versions:

```bash
node --version
corepack --version
```

## First-Time Setup

Run on both macOS Terminal and Windows PowerShell:

```bash
corepack enable
corepack pnpm install
```

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not commit `.env.local`.

## Run Locally

```bash
corepack pnpm dev
```

Open:

```text
http://localhost:3000
```

## Verify Before Pushing

Use the cross-platform verify script:

```bash
corepack pnpm verify
```

This runs:

1. `lint`
2. `typecheck`
3. `build`

Run these checks sequentially. Running `typecheck` and `build` at the same time can race with Next.js `.next/types` generation.

## If The Browser Stops Reacting

If the page loads but buttons do not react, stop the local dev server with `Ctrl+C` and start it again:

```bash
corepack pnpm dev
```

On Windows, from the project folder:

```powershell
.\scripts\start-dev-windows.cmd 3010
```

The app keeps development output in `.next-dev` and production build output in `.next`, so restarting the dev server should restore the CSS and browser interactivity.

## Notes For Windows

- If bare `pnpm` is not recognized, use `corepack pnpm`.
- Avoid Windows-only commands in package scripts.
- The package scripts are written to work through npm/pnpm on both platforms.

## Notes For macOS

- Use Terminal from the repository root.
- If `corepack pnpm` asks to prepare pnpm, allow it.
- Use the same `.env.local` values as the deployed Supabase project.
