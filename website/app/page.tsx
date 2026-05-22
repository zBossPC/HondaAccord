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
        <a href="#" className="nav-logo" aria-label="HondaAccord home">
          <div className="logo-wrap">
            <Image src="/icon.png" alt="" width={32} height={32} className="rounded-[9px]" />
          </div>
          <span className="nav-brand">HondaAccord</span>
        </a>

        <nav className="nav-links" aria-label="Main">
          <a href="#features" className="nav-link">Features</a>
          <a href="#download" className="nav-link">Builds</a>
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
          Download
        </a>
      </div>
    </header>
  );
}

function HeroMockup() {
  return (
    <div className="mock-shell float-anim">
      <div className="mock-glowline" />
      <div className="mock-titlebar">
        <span className="mock-dot bg-[#ff5f57]" />
        <span className="mock-dot bg-[#febc2e]" />
        <span className="mock-dot bg-[#28c840]" />
        <span className="ml-3 text-xs text-[var(--color-text-muted)]">HondaAccord — Night Crew</span>
      </div>
      <div className="mock-body">
        <div className="mock-rail">
          <div className="mock-server active" />
          <div className="mock-server" />
          <div className="mock-server" />
        </div>
        <div className="mock-sidebar">
          <p className="channel-label">Text</p>
          <div className="channel-active"># general</div>
          <div className="channel-idle"># clips</div>
          <p className="channel-label mt-4">Voice</p>
          <div className="voice-active">
            <span className="voice-dot" />
            Lounge · 3
          </div>
        </div>
        <div className="mock-chat">
          <div className="mock-chat-head">
            # general
          </div>
          <div className="mock-messages">
            <div className="mock-message">
              <span className="msg-author cyan">nova </span>
              <span className="msg-time">2:14 AM</span>
              <p className="msg-body">voice tonight?</p>
            </div>
            <div className="mock-message">
              <span className="msg-author red">hex </span>
              <span className="msg-time">2:15 AM</span>
              <p className="msg-body">always. hopping in now</p>
            </div>
            <div className="join-toast">⬡ hex joined Lounge</div>
          </div>
          <div className="mock-input-wrap">
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
            <div className="hero-grid">
              <div className="hero-copy">
                <div className="badge">
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
                <div className="hero-pills">
                  <span>Persistent voice</span>
                  <span>Portable exe</span>
                  <span>Private spaces</span>
                </div>
                <div className="hero-actions">
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
            <div className="stats-grid">
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

          <section id="features" className="feature-section">
            <div className="section-wrap">
              <div className="section-head">
                <p className="section-label">Features</p>
                <h2 className="section-title">
                  Built like an app.
                  <br />
                  <span className="gradient-text-cyan">Not a website reskin.</span>
                </h2>
              </div>
              <div className="feature-grid">
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

          <section className="steps-section">
            <div className="section-wrap">
              <div className="section-head compact">
                <p className="section-label">How it works</p>
              </div>
              <div className="steps-grid">
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
