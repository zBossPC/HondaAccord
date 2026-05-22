# Deploying HondaAccord

This guide covers publishing the GitHub repo and Vercel website.

## 1. GitHub repository

After logging into GitHub CLI (`gh auth login`), create and push the repo:

```powershell
cd C:\Users\charl\Downloads\HondaAccord
gh repo create HondaAccord --public --source=. --remote=origin --push --description "Fast, native Discord-style chat for friends"
```

If the repo name is taken, pick another name and set the website env var:

```
NEXT_PUBLIC_GITHUB_URL=https://github.com/YOUR_USERNAME/YOUR_REPO
```

## 2. Vercel website

From the `website` folder:

```powershell
cd website
vercel login
vercel link
vercel env add NEXT_PUBLIC_GITHUB_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

When linking, use **Root Directory: `website`** if deploying from the monorepo root in the Vercel dashboard.

### Recommended env vars

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_GITHUB_URL` | `https://github.com/youruser/HondaAccord` |
| `NEXT_PUBLIC_SITE_URL` | `https://hondaaccord.vercel.app` |

## 3. GitHub Releases (Windows installer)

Tag a release to trigger the build workflow:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

Add these **GitHub repository secrets** for the release workflow:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_LIVEKIT_URL`

## 4. Optional: CI deploy to Vercel

For automatic website deploys on push to `main`, add these **GitHub secrets**:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Get IDs from `.vercel/project.json` after running `vercel link`.

Also set **GitHub repository variables**:

- `NEXT_PUBLIC_GITHUB_URL`
- `NEXT_PUBLIC_SITE_URL`

## Local website preview

```powershell
cd website
pnpm install --ignore-workspace
pnpm dev
```

Open http://localhost:3000
