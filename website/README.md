# HondaAccord Website

Marketing site for the HondaAccord desktop app. Deployed on Vercel.

## Local development

```bash
cd website
pnpm install --ignore-workspace
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Set these in Vercel project settings:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_GITHUB_URL` | GitHub repo URL (e.g. `https://github.com/youruser/HondaAccord`) |
| `NEXT_PUBLIC_SITE_URL` | Production site URL (e.g. `https://hondaaccord.vercel.app`) |

## Deploy to Vercel

From the `website` directory:

```bash
npx vercel --prod
```

When linking the Vercel project, set the **Root Directory** to `website` if deploying from the monorepo root.
