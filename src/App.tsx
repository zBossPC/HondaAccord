import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import { useAuthStore } from "./stores/authStore";
import { AuthPage } from "./components/auth/AuthPage";
import { MainLayout } from "./components/layout/MainLayout";
import "./index.css";

function App() {
  useAuth();
  const { profile } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 4000);

    supabase.auth
      .getSession()
      .catch((err) => {
        if (!cancelled) {
          setBootError(err instanceof Error ? err.message : "Failed to connect");
        }
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ready) {
    return (
      <div className="loading-screen">
        <div className="loading-logo-wrap">
          <img src="/icon.png" alt="" className="app-logo" />
          <div className="loading-ring" aria-hidden />
        </div>
        <p className="loading-title">HondaAccord</p>
        <p className="loading-sub">Starting up...</p>
      </div>
    );
  }

  if (bootError && !profile) {
    return (
      <div className="crash-screen">
        <img src="/icon.png" alt="" className="app-logo" />
        <h1>Connection issue</h1>
        <p className="crash-message">{bootError}</p>
        {!isSupabaseConfigured && (
          <p className="crash-hint">
            This build may be missing server configuration. Reinstall from GitHub or rebuild with
            Supabase env vars.
          </p>
        )}
        <button type="button" className="crash-reload" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return <AuthPage />;
  }

  return (
    <div className="app-shell">
      {!isSupabaseConfigured && (
        <div className="config-banner">
          Demo mode — backend keys missing. Sign-in and chat will not work until configured.
        </div>
      )}
      <MainLayout />
    </div>
  );
}

export default App;
