import { APP_VERSION } from "./version";

const GITHUB_REPO = "https://github.com/zBossPC/HondaAccord";

const TAURI =
  typeof window !== "undefined" &&
  ("__TAURI_INTERNALS__" in window || "__TAURI__" in window);

export function isDesktopApp(): boolean {
  return TAURI;
}

export function getAppVersion(): string {
  return APP_VERSION;
}

type UpdateResult =
  | { available: false; reason: string }
  | {
      available: true;
      version: string;
      notes: string;
      downloadUrl: string;
      releaseUrl: string;
    };

function parseVersion(v: string): number[] {
  return v.replace(/^v/i, "").split(".").map((n) => parseInt(n, 10) || 0);
}

function isNewer(latest: string, current: string): boolean {
  const a = parseVersion(latest);
  const b = parseVersion(current);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false;
}

function pickInstaller(assets: { name: string; browser_download_url: string }[]): string | null {
  const platform = navigator.platform.toLowerCase();
  const ua = navigator.userAgent.toLowerCase();

  if (platform.includes("mac")) {
    return assets.find((a) => a.name.endsWith(".dmg"))?.browser_download_url ?? null;
  }

  if (platform.includes("linux") || ua.includes("linux")) {
    const appImage = assets.find((a) => a.name.endsWith(".AppImage"));
    const deb = assets.find((a) => a.name.endsWith(".deb"));
    return appImage?.browser_download_url ?? deb?.browser_download_url ?? null;
  }

  const setup = assets.find((a) => a.name.endsWith("-setup.exe"));
  if (setup) return setup.browser_download_url;
  const portable = assets.find(
    (a) => a.name.toLowerCase().includes("portable") && a.name.endsWith(".exe"),
  );
  return portable?.browser_download_url ?? null;
}

export async function checkForAppUpdate(): Promise<UpdateResult> {
  if (!TAURI) {
    return { available: false, reason: "Updates are only available in the desktop app." };
  }

  try {
    const res = await fetch(
      "https://api.github.com/repos/zBossPC/HondaAccord/releases/latest",
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) {
      return { available: false, reason: "Could not reach GitHub releases." };
    }

    const data = await res.json();
    const tag = (data.tag_name as string)?.replace(/^v/i, "") ?? "";
    const assets = (data.assets ?? []) as { name: string; browser_download_url: string }[];
    const downloadUrl = pickInstaller(assets);

    if (!isNewer(tag, APP_VERSION)) {
      return { available: false, reason: `You're on the latest version (v${APP_VERSION}).` };
    }

    if (!downloadUrl) {
      return {
        available: false,
        reason: `v${tag} is available but no installer was found for this platform.`,
      };
    }

    return {
      available: true,
      version: tag,
      notes: (data.body as string) ?? "",
      downloadUrl,
      releaseUrl: (data.html_url as string) ?? `${GITHUB_REPO}/releases`,
    };
  } catch {
    return { available: false, reason: "Update check failed. Check your connection." };
  }
}

export async function installAppUpdate(
  update: Extract<UpdateResult, { available: true }>,
): Promise<void> {
  const { openUrl } = await import("@tauri-apps/plugin-opener");
  await openUrl(update.downloadUrl);
}
