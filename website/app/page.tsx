import Image from "next/image";
import { DownloadSection } from "@/components/DownloadSection";
import { GITHUB_REPO, getLatestRelease, pickWindowsAssets } from "@/lib/releases";

export const revalidate = 60;

const features = [
  {
    icon: "◆",
    title: "Private Spaces",
    description: "Invite-only rooms for your crew with text, voice, and clean space settings.",
    accent: "red",
  },
  {
    icon: "●",
    title: "Friends & DMs",
    description: "Add people by username, accept requests, and jump straight into private DMs.",
    accent: "cyan",
  },
  {
    icon: "◉",
    title: "Persistent Voice",
    description: "Stay connected while you move around the app, with native-style controls.",
    accent: "cyan",
  },
  {
    icon: "▰",
    title: "Screen Share",
    description: "Share your screen from a dedicated stage built for desktop sessions.",
    accent: "red",
  },
  {
    icon: "✦",
    title: "Native Performance",
    description: "Tauri desktop shell, low overhead, and a focused Windows-first experience.",
    accent: "red",
  },
  {
    icon: "◇",
    title: "Realtime Sync",
    description: "Messages, presence, and voice state synced instantly via Supabase.",
    accent: "cyan",
  },
];

function Nav() {
  return (
    <header className="nav-bar">
      <div className="nav-inner">
        <a href="#" className="nav-logo group">
          <div className="logo-wrap">
            <Image src="/icon.png" alt="" width={32} height={32} className="rounded-[9px]" />
          </div>
          <span className="nav-brand">HondaAccord</span>
        </a>

        <nav className="nav-links" aria-label="Main">
          <a href="#features" className="nav-link">Features</a>
          <a href="#download" className="nav-link">Releases</a>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
        </nav>

        <a href="#download" className="nav-cta btn-primary">
          Get App
        </a>
      </div>
    </header>
  );
}

function HeroMockup() {
  return (
    <div className="mock-shell float-anim w-full max-w-lg">
      <div className="mock-glowline" />
      <div className="mock-titlebar">
        <span className="mock-dot bg-[#ff5f57]" />
        <span className="mock-dot bg-[#febc2e]" />
        <span className="mock-dot bg-[#28c840]" />
        <span className="ml-3 text-xs text-[var(--color-text-muted)]">HondaAccord — Night Crew</span>
      </div>
      <div className="flex h-[19rem]">
        <div className="flex w-14 flex-col items-center gap-2.5 border-r border-[var(--color-border)] bg-black/40 py-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#ff0033] to-[#990022] shadow-[0_0_16px_rgba(255,0,51,0.45)]" />
          <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
          <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
        </div>
        <div className="w-44 border-r border-[var(--color-border)] bg-[#0a0a10] p-3">
          <p className="channel-label">Text</p>
          <div className="channel-active"># general</div>
          <div className="channel-idle"># clips</div>
          <p className="channel-label mt-4">Voice</p>
          <div className="voice-active">
            <span className="voice-dot" />
            Lounge · 3
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-[#050508]">
          <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-white/80">
            # general
          </div>
          <div className="flex-1 space-y-3 p-3">
            <div>
              <span className="msg-author cyan">nova </span>
              <span className="msg-time">2:14 AM</span>
              <p className="msg-body">voice tonight?</p>
            </div>
            <div>
              <span className="msg-author red">hex </span>
              <span className="msg-time">2:15 AM</span>
              <p className="msg-body">always. hopping in now</p>
            </div>
            <div className="join-toast">⬡ hex joined Lounge</div>
          </div>
          <div className="border-t border-[var(--color-border)] p-2.5">
            <div className="msg-input">Message #general</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const release = await getLatestRelease();
  const { setup, portable } = release
    ? pickWindowsAssets(release.assets)
    : { setup: undefined, portable: undefined };
  const primaryDownload = setup?.url ?? portable?.url ?? `${GITHUB_REPO}/releases`;
  const downloadLabel = setup || portable ? `Download ${release?.tag ?? ""}`.trim() : "View Releases";

  return (
    <>
      <div className="bg-grid" aria-hidden />
      <div className="bg-glow-red" aria-hidden />
      <div className="bg-glow-cyan" aria-hidden />
      <div className="bg-noise" aria-hidden />

      <div className="page-content min-h-screen">
        <Nav />

        <main>
          <section className="hero-section">
            <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-20 md:grid-cols-2 md:py-28">
              <div>
                <div className="badge mb-7">
                  <span className="badge-dot" />
                  v{release?.tag?.replace(/^v/i, "") ?? "..."} · Windows desktop · Open source
                </div>
                <h1 className="hero-title">
                  Desktop chat
                  <br />
                  <span className="gradient-text">for your crew.</span>
                </h1>
                <p className="hero-sub">
                  HondaAccord is a fast private chat app for friend groups: spaces, DMs,
                  persistent voice, screen share, and a desktop-first interface.
                </p>
                <div className="hero-pills mb-6">
                  <span>Persistent voice</span>
                  <span>Portable exe</span>
                  <span>Private spaces</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={primaryDownload} className="btn-primary btn-lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {downloadLabel}
                  </a>
                  <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-lg">
                    View on GitHub
                  </a>
                </div>
                <div className="release-strip">
                  <span>Latest</span>
                  <strong>{release?.tag ?? "Coming soon"}</strong>
                  <span>Windows x64</span>
                </div>
              </div>
              <div className="hero-mockup-wrap">
                <HeroMockup />
              </div>
            </div>
          </section>

          <section className="stats-section">
            <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
              {[
                { value: "Tauri", label: "Native shell" },
                { value: "Voice", label: "Stays connected" },
                { value: "Private", label: "Invite spaces" },
                { value: "Free", label: "Open source" },
              ].map((s) => (
                <div key={s.label} className="stat-cell">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-16 text-center">
                <p className="section-label">Features</p>
                <h2 className="section-title">
                  Built like an app.
                  <br />
                  <span className="gradient-text-cyan">Not a website reskin.</span>
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f) => (
                  <div key={f.title} className={`feature-card feature-${f.accent}`}>
                    <div className="feature-icon-wrap">{f.icon}</div>
                    <h3 className="feature-title">{f.title}</h3>
                    <p className="feature-desc">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <DownloadSection />

          <section className="py-20 border-t border-[var(--color-border)]">
            <div className="mx-auto max-w-6xl px-6">
              <p className="section-label text-center mb-8">How it works</p>
              <div className="grid gap-5 md:grid-cols-3">
                {[
                  { n: "01", t: "Download", d: "Install HondaAccord on Windows in one click." },
                  { n: "02", t: "Sign up", d: "Username + password. No email required." },
                  { n: "03", t: "Connect", d: "Add friends, create a Space, start talking." },
                ].map((s) => (
                  <div key={s.n} className="step-card">
                    <div className="step-num">{s.n}</div>
                    <h3 className="step-title">{s.t}</h3>
                    <p className="step-desc">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/icon.png" alt="" width={28} height={28} className="rounded-lg" />
              <span className="text-sm text-[var(--color-text-muted)]">
                HondaAccord · MIT License · Built with Tauri, React, Supabase & LiveKit
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
              <a href={`${GITHUB_REPO}/releases`} target="_blank" rel="noopener noreferrer" className="footer-link">Releases</a>
              <a href="https://hondaaccord.lol" className="footer-link">hondaaccord.lol</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
