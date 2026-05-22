import { GITHUB_REPO, formatBytes, getLatestRelease, pickPlatformAssets } from "@/lib/releases";

function WindowsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 5.5L10.5 4.2v7.1H3V5.5zm0 8.2h7.5v7.1L3 19.5V13.7zm9-9.3L21 3.1v8.6h-9V4.4zm0 9.3h9v8.6l-9-1.6v-7z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 2.1c.1 1.2-.4 2.3-1.1 3.1-.8.9-2 1.5-3.1 1.4-.1-1.1.4-2.3 1.1-3.1.8-.9 2.1-1.5 3.1-1.4ZM20.3 17.2c-.5 1.1-.8 1.6-1.5 2.6-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-3.9-1s-2.5 1-3.9 1c-1.7 0-3-1.7-4-3.2-2.8-4.3-3.1-9.3-1.4-12 1.2-1.9 3-3 4.8-3 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.4 7.9.7 9.9Z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2c2.2 0 4 2.1 4 4.7 0 1.2.4 2.4 1.1 3.4l2.2 3.2c.5.7.7 1.5.7 2.3 0 2.4-2.1 4.4-4.7 4.4h-.7c-.7 1.2-1.5 2-2.6 2s-1.9-.8-2.6-2h-.7C6.1 20 4 18 4 15.6c0-.8.2-1.6.7-2.3l2.2-3.2C7.6 9.1 8 7.9 8 6.7 8 4.1 9.8 2 12 2Zm-2.3 9.6c-.8.8-1.5 1.9-1.7 3.2-.2 1.1.2 2.1 1.1 2.8.9.7 1.9.4 2.9.4s2 .3 2.9-.4c.9-.7 1.3-1.7 1.1-2.8-.2-1.3-.9-2.4-1.7-3.2-.7.5-1.5.8-2.3.8s-1.6-.3-2.3-.8ZM10 6.5c-.4 0-.8.4-.8.9s.4.9.8.9.8-.4.8-.9-.4-.9-.8-.9Zm4 0c-.4 0-.8.4-.8.9s.4.9.8.9.8-.4.8-.9-.4-.9-.8-.9Z" />
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
  const { setup, portable, mac, appImage, deb } = release
    ? pickPlatformAssets(release.assets)
    : { setup: undefined, portable: undefined, mac: undefined, appImage: undefined, deb: undefined };
  const releasesUrl = `${GITHUB_REPO}/releases`;
  const hasDownloads = setup || portable || mac || appImage || deb;

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
              Free, open source, and ready for desktop. Pick the build for your platform.
            </p>

            {release && hasDownloads ? (
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

                <div className="download-grid">
                  {setup && (
                    <a href={setup.url} className="download-card download-card-primary">
                      <div className="download-card-icon">
                        <WindowsIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="download-card-title">Windows Setup (.exe)</div>
                        <div className="download-card-sub">
                          Recommended · Installs shortcuts · {formatBytes(setup.size)}
                        </div>
                      </div>
                      <span className="download-card-action">
                        <DownloadIcon />
                        Download
                      </span>
                    </a>
                  )}

                  {portable && (
                    <a href={portable.url} className="download-card">
                      <div className="download-card-icon">
                        <WindowsIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="download-card-title">Portable App (.exe)</div>
                        <div className="download-card-sub">
                          No install · Run directly · {formatBytes(portable.size)}
                        </div>
                      </div>
                      <span className="download-card-action">
                        <DownloadIcon />
                        Download
                      </span>
                    </a>
                  )}
                  {mac && (
                    <a href={mac.url} className="download-card">
                      <div className="download-card-icon">
                        <AppleIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="download-card-title">macOS Disk Image (.dmg)</div>
                        <div className="download-card-sub">
                          Apple desktop build · {formatBytes(mac.size)}
                        </div>
                      </div>
                      <span className="download-card-action">
                        <DownloadIcon />
                        Download
                      </span>
                    </a>
                  )}
                  {appImage && (
                    <a href={appImage.url} className="download-card">
                      <div className="download-card-icon">
                        <LinuxIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="download-card-title">Linux AppImage</div>
                        <div className="download-card-sub">
                          Portable Linux build · {formatBytes(appImage.size)}
                        </div>
                      </div>
                      <span className="download-card-action">
                        <DownloadIcon />
                        Download
                      </span>
                    </a>
                  )}
                  {deb && (
                    <a href={deb.url} className="download-card">
                      <div className="download-card-icon">
                        <LinuxIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="download-card-title">Linux Debian Package (.deb)</div>
                        <div className="download-card-sub">
                          Debian/Ubuntu installer · {formatBytes(deb.size)}
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
                  Windows, macOS, and Linux builds are generated from GitHub releases.{" "}
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
            { label: "Platforms", value: "Windows · macOS · Linux" },
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
