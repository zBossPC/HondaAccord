# HondaAccord

A fast, native Discord-style desktop app for chatting with friends. Uses **Spaces** instead of servers — private groups you create and invite friends into.

Built with **Tauri 2**, **React**, **Supabase**, and **LiveKit**.

**Website:** See [`website/`](website/) for the marketing site (Next.js, deploys to Vercel).

## Prerequisites

- Node.js 20+
- pnpm
- Rust (for Tauri)
- [Supabase](https://supabase.com) project (free tier)
- [LiveKit Cloud](https://livekit.io) project (free Build plan)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your keys:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → **Project Settings** → **API** → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Same page → `anon` public key |
| `VITE_LIVEKIT_URL` | LiveKit Cloud → your project → **Settings** → WebSocket URL (`wss://...`) |

### 3. Run database migration

Link your Supabase project and push migrations:

```bash
pnpm supabase login
pnpm supabase link --project-ref YOUR_PROJECT_REF
pnpm supabase db push
```

Your project ref is the ID in your Supabase URL: `https://YOUR_PROJECT_REF.supabase.co`

### 4. Deploy LiveKit token function

Set secrets and deploy the Edge Function:

```bash
pnpm supabase secrets set LIVEKIT_API_KEY=your_key LIVEKIT_API_SECRET=your_secret
pnpm supabase functions deploy livekit-token
```

LiveKit keys: LiveKit Cloud → **Settings** → **Keys**

### 5. Enable username/password auth

HondaAccord shows users a simple username/password form. Internally it uses Supabase Email Auth with a hidden synthetic email format like `username@hondaaccord.app`.

In Supabase Dashboard → **Authentication** → **Providers** → enable **Email**.

For development, disable email confirmation: **Authentication** → **Providers** → Email → turn off "Confirm email". This is required because test users do not enter real emails.

### 6. Run the app

**Windows (if `pnpm` gives a script error):** double-click `dev.cmd` or run:

```cmd
dev.cmd
```

Or use `pnpm.cmd` instead of `pnpm`:

```cmd
pnpm.cmd tauri dev
```

**Mac/Linux:**

```bash
pnpm tauri dev
```

Alternative on Windows:

```cmd
npm run tauri:dev
```

## Testing voice + screen share

1. Create two accounts with username + password (two machines, or one desktop + browser with a second instance)
2. Add each other as friends by username
3. Create a Space and invite your friend (Friends → Invite to Space)
4. Both join the **Voice** channel and click **Join Voice**
5. Use the screen share button to share your screen

## Features (MVP)

- Username/password auth
- Friend requests and friend list with online status
- Spaces with text + voice channels
- Real-time text chat
- 1:1 DMs
- Voice channels (LiveKit)
- Screen sharing with selectable quality up to a 4K/60 preferred profile

## Project structure

```
src/                  React frontend
src-tauri/            Tauri Rust shell
supabase/migrations/  Database schema + RLS
supabase/functions/   Edge Functions (LiveKit tokens)
```

## Build for production

```bash
pnpm tauri build
```

Installers appear in `src-tauri/target/release/bundle/`.
