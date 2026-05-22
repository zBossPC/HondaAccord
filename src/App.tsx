import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useAuth } from "./hooks/useAuth";
import { useAuthStore } from "./stores/authStore";
import { AuthPage } from "./components/auth/AuthPage";
import { MainLayout } from "./components/layout/MainLayout";
import "./index.css";

function App() {
  useAuth();
  const { profile } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 5000);
    supabase.auth.getSession().finally(() => {
      clearTimeout(timeout);
      setReady(true);
    });
    return () => clearTimeout(timeout);
  }, []);

  if (!ready) {
    return (
      <div className="loading-screen">
        <img src="/icon.png" alt="" className="app-logo" />
        <p>Loading HondaAccord...</p>
      </div>
    );
  }

  if (!profile) {
    return <AuthPage />;
  }

  return (
    <div className="app-shell">
      <MainLayout />
    </div>
  );
}

export default App;
