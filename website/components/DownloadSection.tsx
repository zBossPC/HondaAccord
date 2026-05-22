import { GITHUB_REPO, formatBytes, getLatestRelease, pickWindowsAssets } from "@/lib/releases";

function WindowsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 5.5L10.5 4.2v7.1H3V5.5zm0 8.2h7.5v7.1L3 19.5V13.7zm9-9.3L21 3.1v8.6h-9V4.4zm0 9.3h9v8.6l-9-1.6v-7z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function DownloadSection() {
  const release = await getLatestRelease();
  const { msi, exe } = release ? pickWindowsAssets(release.assets) : { msi: undefined, exe: undefined };
  const releasesUrl = `${GITHUB_REPO}/releases`;

  return (
    <section id="download" className="download-section">
      <div className="mx-auto max-w-5xl px-6">
        <div className="download-panel">
          <div className="download-panel-glow" aria-hidden />

          <div className="relative z-10">
            <p className="section-label text-center">Download</p>
            <h2
              className="mb-3 text-center text-4xl font-bold tracking-tight md:text-5xl"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Get HondaAccord
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-center text-[var(--color-text-muted)]">
              Free, open source, and ready for Windows. Pick an installer below — no account needed to download.
            </p>

            {release && (msi || exe) ? (
              <>
                <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                  <span className="version-badge">{release.tag}</span>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Released {new Date(release.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {msi && (
                    <a href={msi.url} className="download-card download-card-primary">
                      <div className="download-card-icon">
                        <WindowsIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="download-card-title">Windows Installer (.msi)</div>
                        <div className="download-card-sub">
                          Recommended · Enterprise-friendly · {formatBytes(msi.size)}
                        </div>
                      </div>
                      <span className="download-card-action">
                        <DownloadIcon />
                        Download
                      </span>
                    </a>
                  )}

                  {exe && (
                    <a href={exe.url} className="download-card">
                      <div className="download-card-icon">
                        <WindowsIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="download-card-title">Windows Setup (.exe)</div>
                        <div className="download-card-sub">
                          NSIS installer · User-friendly · {formatBytes(exe.size)}
                        </div>
                      </div>
                      <span className="download-card-action">
                        <DownloadIcon />
                        Download
                      </span>
                    </a>
                  )}
                </div>

                <p className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
                  macOS and Linux builds are on the roadmap.{" "}
                  <a href={release.pageUrl} className="text-[#ff6680] hover:underline">
                    View release notes →
                  </a>
                </p>
              </>
            ) : (
              <div className="download-empty">
                <p className="mb-6 text-[var(--color-text-muted)]">
                  Installers are being prepared. Check GitHub Releases for the latest builds, or build from source.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a href={releasesUrl} className="btn-primary">
                    <DownloadIcon />
                    View GitHub Releases
                  </a>
                  <a href={`${GITHUB_REPO}#readme`} className="btn-ghost">
                    Build from source
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Platform", value: "Windows 10/11" },
            { label: "Architecture", value: "x64" },
            { label: "License", value: "MIT · Free forever" },
          ].map((item) => (
            <div key={item.label} className="spec-chip">
              <span className="spec-chip-label">{item.label}</span>
              <span className="spec-chip-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
