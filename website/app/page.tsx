import Image from "next/image";

const githubUrl =
  process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/hondaaccord/hondaaccord";

const features = [
  {
    icon: "💬",
    title: "Private Spaces",
    description:
      "Create invite-only groups for your friends — like servers, but yours. Text and voice channels included.",
  },
  {
    icon: "👥",
    title: "Friends & DMs",
    description:
      "Add friends by username, accept requests, and jump into 1:1 direct messages anytime.",
  },
  {
    icon: "🎙️",
    title: "Voice channels",
    description:
      "Crystal-clear voice chat powered by LiveKit. Join a voice channel and talk with your group instantly.",
  },
  {
    icon: "🖥️",
    title: "Screen sharing",
    description:
      "Share your screen in voice with selectable quality — up to 4K at 60fps for presentations and gaming.",
  },
  {
    icon: "⚡",
    title: "Native & lightweight",
    description:
      "Built with Tauri 2 for a fast, low-memory desktop experience on Windows, macOS, and Linux.",
  },
  {
    icon: "🔒",
    title: "Your circle, your rules",
    description:
      "No public server discovery. Every Space is private — only people you invite can join.",
  },
];

const steps = [
  {
    step: "1",
    title: "Download HondaAccord",
    description: "Grab the installer for your platform from GitHub Releases.",
  },
  {
    step: "2",
    title: "Create an account",
    description: "Pick a username and password — no email required.",
  },
  {
    step: "3",
    title: "Add friends & create a Space",
    description: "Send friend requests, spin up a Space, and start chatting.",
  },
];

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[#111214]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3 no-underline">
          <Image src="/icon.png" alt="" width={36} height={36} className="rounded-[10px]" />
          <span className="text-lg font-semibold text-[var(--color-text-primary)]">
            HondaAccord
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-[var(--color-text-muted)] no-underline transition hover:text-white"
          >
            Features
          </a>
          <a
            href="#download"
            className="text-sm text-[var(--color-text-muted)] no-underline transition hover:text-white"
          >
            Download
          </a>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

function HeroMockup() {
  return (
    <div className="mock-window w-full max-w-xl">
      <div className="mock-titlebar">
        <span className="mock-dot bg-[#ff5f57]" />
        <span className="mock-dot bg-[#febc2e]" />
        <span className="mock-dot bg-[#28c840]" />
        <span className="ml-3 text-xs text-[var(--color-text-muted)]">HondaAccord</span>
      </div>
      <div className="flex h-64 md:h-72">
        <div className="flex w-14 flex-col items-center gap-3 border-r border-[var(--color-border)] bg-[#0d0e10] py-4">
          <div className="h-9 w-9 rounded-xl bg-[var(--color-brand)]" />
          <div className="h-9 w-9 rounded-xl bg-[var(--color-bg-elevated)]" />
          <div className="h-9 w-9 rounded-xl bg-[var(--color-bg-elevated)]" />
        </div>
        <div className="w-44 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Text Channels
          </p>
          <div className="space-y-1.5">
            <div className="rounded-md bg-[var(--color-bg-elevated)] px-2 py-1.5 text-xs text-white">
              # general
            </div>
            <div className="px-2 py-1.5 text-xs text-[var(--color-text-muted)]"># memes</div>
          </div>
          <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Voice
          </p>
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-[#23a559]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#23a559]" />
            Lounge
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-[var(--color-bg-primary)]">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-medium">
            # general
          </div>
          <div className="flex-1 space-y-3 p-4">
            <div>
              <span className="text-xs font-semibold text-[#5865f2]">alex </span>
              <span className="text-[10px] text-[var(--color-text-muted)]">Today at 2:14 PM</span>
              <p className="mt-0.5 text-xs text-[var(--color-text-primary)]">
                anyone down for voice tonight?
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#eb459e]">sam </span>
              <span className="text-[10px] text-[var(--color-text-muted)]">Today at 2:15 PM</span>
              <p className="mt-0.5 text-xs text-[var(--color-text-primary)]">yeah im in 🎙️</p>
            </div>
          </div>
          <div className="border-t border-[var(--color-border)] p-3">
            <div className="rounded-lg bg-[var(--color-bg-secondary)] px-3 py-2 text-xs text-[var(--color-text-muted)]">
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
    <div className="min-h-screen">
      <Nav />

      <main>
        {/* Hero */}
        <section className="gradient-glow border-b border-[var(--color-border)]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
            <div>
              <p className="mb-4 inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-brand-muted)] px-3 py-1 text-xs font-medium text-[var(--color-brand)]">
                Open source · Cross-platform · Free
              </p>
              <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Chat with friends.
                <br />
                <span className="text-[var(--color-brand)]">No servers required.</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)]">
                HondaAccord is a fast, native desktop app for private group chat, voice, and screen
                sharing — built for friend groups, not public communities.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={releaseUrl} className="btn-primary">
                  Download for Windows
                </a>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  View on GitHub
                </a>
              </div>
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                macOS and Linux builds coming soon. Windows installer available now.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <HeroMockup />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-[var(--color-border)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold">Everything you need to hang out</h2>
              <p className="mx-auto max-w-2xl text-[var(--color-text-muted)]">
                All the core Discord-style features — friends, DMs, Spaces, voice, and screen share
                — in a lightweight native app.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="card p-6">
                  <div className="feature-icon mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold">Up and running in minutes</h2>
              <p className="text-[var(--color-text-muted)]">No complicated setup. Just download and go.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((item) => (
                <div key={item.step} className="card p-6 text-center">
                  <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand)] text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section id="download" className="gradient-glow py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Image
              src="/icon.png"
              alt="HondaAccord"
              width={80}
              height={80}
              className="mx-auto mb-6 rounded-[18px] shadow-lg"
            />
            <h2 className="mb-4 text-3xl font-bold">Ready to try HondaAccord?</h2>
            <p className="mb-8 text-[var(--color-text-muted)]">
              Download the latest release, create your account, and invite your friends to a Space.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={releaseUrl} className="btn-primary">
                Get the Windows installer
              </a>
              <a href={`${githubUrl}#readme`} className="btn-secondary">
                Read the docs
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
              HondaAccord — built with Tauri, React, Supabase & LiveKit
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-text-muted)] no-underline transition hover:text-white"
            >
              GitHub
            </a>
            <a
              href={`${githubUrl}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-text-muted)] no-underline transition hover:text-white"
            >
              Releases
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
