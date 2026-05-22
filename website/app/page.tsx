import Image from "next/image";

const githubUrl =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/zBossPC/HondaAccord";

const features = [
  {
    icon: "◈",
    title: "Private Spaces",
    description: "Invite-only groups with text and voice channels. Your crew, your rules — no public discovery.",
    span: "bento-large",
  },
  {
    icon: "◎",
    title: "Friends & DMs",
    description: "Add by username, accept requests, jump into 1:1 messages instantly.",
    span: "",
  },
  {
    icon: "⬡",
    title: "Voice Channels",
    description: "Low-latency voice powered by LiveKit WebRTC. Join and talk in one click.",
    span: "",
  },
  {
    icon: "▣",
    title: "Screen Sharing",
    description: "Share your screen at up to 4K/60. Perfect for gaming, collab, or presentations.",
    span: "",
  },
  {
    icon: "⚡",
    title: "Native Performance",
    description: "Tauri 2 shell — fast startup, low RAM, runs on Windows, macOS, and Linux.",
    span: "",
  },
  {
    icon: "⬢",
    title: "Realtime Everything",
    description: "Live messages, presence, and voice state synced instantly via Supabase Realtime.",
    span: "bento-large",
  },
];

const stats = [
  { value: "<50MB", label: "Memory footprint" },
  { value: "4K/60", label: "Screen share quality" },
  { value: "0", label: "Public servers" },
  { value: "Free", label: "Forever" },
];

const tech = ["Tauri 2", "React", "Supabase", "LiveKit", "TypeScript", "WebRTC"];

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[#050508]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3 no-underline">
          <div className="relative">
            <Image src="/icon.png" alt="" width={36} height={36} className="rounded-[10px]" />
            <span className="absolute -inset-1 rounded-[12px] bg-[var(--color-brand)] opacity-20 blur-sm" />
          </div>
          <span
            className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            HondaAccord
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {["Features", "Download"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-[var(--color-text-muted)] no-underline transition hover:text-white"
            >
              {item}
            </a>
          ))}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm py-2 px-4">
            GitHub →
          </a>
        </nav>
      </div>
    </header>
  );
}

function HeroMockup() {
  return (
    <div className="mock-shell float-anim w-full max-w-lg">
      <div className="mock-titlebar">
        <span className="mock-dot bg-[#ff5f57]" />
        <span className="mock-dot bg-[#febc2e]" />
        <span className="mock-dot bg-[#28c840]" />
        <span className="ml-3 text-xs text-[var(--color-text-muted)]">HondaAccord — Space: Night Crew</span>
      </div>
      <div className="flex h-72">
        <div className="flex w-14 flex-col items-center gap-2.5 border-r border-[var(--color-border)] bg-black/40 py-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#ff0033] to-[#cc0028] shadow-[0_0_12px_rgba(255,0,51,0.4)]" />
          <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
          <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
        </div>
        <div className="w-44 border-r border-[var(--color-border)] bg-[#0a0a10] p-3">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Text
          </p>
          <div className="mb-1 rounded-lg bg-white/8 px-2 py-1.5 text-xs text-white border border-[rgba(255,0,51,0.3)]">
            # general
          </div>
          <div className="px-2 py-1.5 text-xs text-[var(--color-text-muted)]"># clips</div>
          <p className="mb-2 mt-4 text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            Voice
          </p>
          <div className="flex items-center gap-1.5 rounded-lg bg-[rgba(0,229,255,0.08)] px-2 py-1.5 text-xs text-[#00e5ff] border border-[rgba(0,229,255,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] animate-pulse" />
            Lounge · 3
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-[#050508]">
          <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold text-white/80">
            # general
          </div>
          <div className="flex-1 space-y-3 p-3 overflow-hidden">
            <div>
              <span className="text-[11px] font-bold text-[#00e5ff]">nova </span>
              <span className="text-[9px] text-[var(--color-text-muted)]">2:14 AM</span>
              <p className="mt-0.5 text-[11px] text-white/80">voice tonight? 🎙️</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#ff6680]">hex </span>
              <span className="text-[9px] text-[var(--color-text-muted)]">2:15 AM</span>
              <p className="mt-0.5 text-[11px] text-white/80">always. hopping in now</p>
            </div>
            <div className="rounded-lg border border-[rgba(0,229,255,0.15)] bg-[rgba(0,229,255,0.05)] px-2 py-1.5">
              <p className="text-[10px] text-[#00e5ff]">⬡ hex joined Lounge</p>
            </div>
          </div>
          <div className="border-t border-[var(--color-border)] p-2.5">
            <div className="rounded-lg bg-white/4 px-3 py-2 text-[10px] text-[var(--color-text-muted)] border border-white/6">
              Message #general
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const releaseUrl = `${githubUrl}/releases/latest`;

  return (
    <>
      <div className="bg-grid" aria-hidden />
      <div className="bg-glow-red" aria-hidden />
      <div className="bg-glow-cyan" aria-hidden />

      <div className="page-content min-h-screen">
        <Nav />

        <main>
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
              <div>
                <div className="badge mb-6">
                  <span className="badge-dot" />
                  Open source · Native · Free
                </div>
                <h1
                  className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  Private chat,
                  <br />
                  <span className="gradient-text">reimagined.</span>
                </h1>
                <p className="mb-10 max-w-md text-lg leading-relaxed text-[var(--color-text-muted)]">
                  HondaAccord is a fast, native desktop app for your friend group — text, voice,
                  screen share, and private Spaces. No algorithms. No public servers.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href={releaseUrl} className="btn-primary">
                    ↓ Download for Windows
                  </a>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    View source
                  </a>
                </div>
                <p className="mt-5 text-xs text-[var(--color-text-muted)]">
                  macOS & Linux builds coming soon · No account required to download
                </p>
              </div>
              <div className="relative flex justify-center md:justify-end">
                <div className="absolute inset-0 rounded-full bg-[rgba(255,0,51,0.12)] blur-3xl" aria-hidden />
                <HeroMockup />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="border-y border-[var(--color-border)] bg-white/[0.02]">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-[var(--color-border)] md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#050508] px-8 py-10 text-center">
                  <div
                    className="stat-value mb-2"
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features bento */}
          <section id="features" className="py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-14 text-center">
                <p className="section-label">Capabilities</p>
                <h2
                  className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  Built for{" "}
                  <span className="gradient-text-cyan">real connections</span>
                </h2>
                <p className="mx-auto max-w-xl text-[var(--color-text-muted)]">
                  Everything Discord does for friend groups — without the noise of public communities.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f) => (
                  <div key={f.title} className={`glass-card p-7 ${f.span}`}>
                    <div className="feature-icon-wrap mb-5">{f.icon}</div>
                    <h3
                      className="mb-2 text-xl font-bold"
                      style={{ fontFamily: "var(--font-display), sans-serif" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="divider-glow mx-auto max-w-6xl" />

          {/* Tech stack */}
          <section className="py-16">
            <div className="mx-auto max-w-6xl px-6 text-center">
              <p className="section-label mb-6">Powered by</p>
              <div className="flex flex-wrap justify-center gap-3">
                {tech.map((t) => (
                  <span key={t} className="tech-pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-24 bg-white/[0.015]">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-14 text-center">
                <p className="section-label">Get started</p>
                <h2
                  className="text-4xl font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  Three steps. That&apos;s it.
                </h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { n: "01", title: "Download", desc: "Grab the Windows installer from GitHub Releases." },
                  { n: "02", title: "Sign up", desc: "Pick a username and password. No email needed." },
                  { n: "03", title: "Connect", desc: "Add friends, create a Space, start talking." },
                ].map((step) => (
                  <div key={step.n} className="glass-card p-8">
                    <div
                      className="mb-4 text-4xl font-bold text-[rgba(255,0,51,0.3)]"
                      style={{ fontFamily: "var(--font-display), sans-serif" }}
                    >
                      {step.n}
                    </div>
                    <h3
                      className="mb-2 text-xl font-bold"
                      style={{ fontFamily: "var(--font-display), sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Download CTA */}
          <section id="download" className="relative py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,0,51,0.06)] to-transparent" aria-hidden />
            <div className="relative mx-auto max-w-3xl px-6 text-center">
              <div className="relative mx-auto mb-8 inline-block">
                <Image
                  src="/icon.png"
                  alt="HondaAccord"
                  width={88}
                  height={88}
                  className="rounded-[20px]"
                />
                <span className="absolute -inset-3 rounded-[24px] bg-[var(--color-brand)] opacity-20 blur-xl" />
              </div>
              <h2
                className="mb-4 text-4xl font-bold tracking-tight md:text-5xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                Ready to{" "}
                <span className="gradient-text">join the crew?</span>
              </h2>
              <p className="mb-10 text-lg text-[var(--color-text-muted)]">
                Download HondaAccord, create your account, and invite your friends into a Space.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href={releaseUrl} className="btn-primary text-base px-8">
                  Get Windows installer
                </a>
                <a href={`${githubUrl}#readme`} className="btn-ghost text-base px-8">
                  Read docs
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[var(--color-border)] py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/icon.png" alt="" width={28} height={28} className="rounded-lg" />
              <span className="text-sm text-[var(--color-text-muted)]">
                HondaAccord · Tauri · React · Supabase · LiveKit
              </span>
            </div>
            <div className="flex gap-6">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-muted)] no-underline hover:text-white transition">
                GitHub
              </a>
              <a href={`${githubUrl}/releases`} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-text-muted)] no-underline hover:text-white transition">
                Releases
              </a>
              <a href="https://hondaaccord.lol" className="text-sm text-[var(--color-text-muted)] no-underline hover:text-white transition">
                hondaaccord.lol
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
