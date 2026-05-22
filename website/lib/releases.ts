import type { ReleaseAsset, ReleaseInfo } from "./types";

const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/zBossPC/HondaAccord";
const REPO_SLUG = GITHUB_REPO.replace("https://github.com/", "");

/** Rebuild download/version info at most every minute between deploys. */
export const REVALIDATE_SECONDS = 60;

export async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_SLUG}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const assets: ReleaseAsset[] = (data.assets ?? []).map(
      (a: { name: string; browser_download_url: string; size: number }) => ({
        name: a.name,
        url: a.browser_download_url,
        size: a.size,
      }),
    );

    return {
      tag: data.tag_name as string,
      name: data.name as string,
      publishedAt: data.published_at as string,
      body: data.body as string,
      assets,
      pageUrl: data.html_url as string,
    };
  } catch {
    return null;
  }
}

export function pickWindowsAssets(assets: ReleaseAsset[]) {
  const msi = assets.find((a) => a.name.endsWith(".msi"));
  const exe = assets.find((a) => a.name.endsWith("-setup.exe") || a.name.endsWith(".exe"));
  return { msi, exe };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export { GITHUB_REPO };
