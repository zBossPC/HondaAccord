import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";
import type { Profile } from "../types";

const LOCAL_AUTH_DOMAIN = "hondaaccord.app";
const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

function normalizeUsername(username: string) {
  return username.trim().replace(/^@/, "").toLowerCase();
}

function usernameToLocalEmail(username: string) {
  return `${normalizeUsername(username)}@${LOCAL_AUTH_DOMAIN}`;
}

function credentialToEmail(credential: string) {
  const value = credential.trim();
  return value.includes("@") ? value : usernameToLocalEmail(value);
}

function withTimeout<T>(promise: PromiseLike<T>, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error(`${label} timed out. Check your connection and try again.`)),
      15000,
    );

    Promise.resolve(promise)
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timeout));
  });
}

export function useAuth() {
  const { profile, setProfile } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        await loadProfile(session.user.id);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          // Supabase warns against awaiting more Supabase calls inside this callback.
          window.setTimeout(() => {
            void loadProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setProfile]);

  async function loadProfile(userId: string) {
    const { data, error } = await withTimeout(
      supabase.from("profiles").select("*").eq("id", userId).single(),
      "Profile load",
    );
    if (error) throw error;
    if (data) setProfile(data as Profile);
  }

  async function signIn(username: string, password: string) {
    const email = credentialToEmail(username);
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      "Sign in",
    );
    if (error) throw error;
    if (data.user) await loadProfile(data.user.id);
  }

  async function signUp(username: string, password: string) {
    const normalizedUsername = normalizeUsername(username);
    if (!USERNAME_RE.test(normalizedUsername)) {
      throw new Error("Use 3-24 letters, numbers, or underscores.");
    }

    const { data, error } = await withTimeout(
      supabase.functions.invoke("username-signup", {
        body: {
          username: normalizedUsername,
          password,
        },
      }),
      "Account creation",
    );

    if (error) throw error;
    if (data && typeof data === "object" && "error" in data) {
      throw new Error(String(data.error));
    }

    const { data: signInData, error: signInError } = await withTimeout(
      supabase.auth.signInWithPassword({
        email: usernameToLocalEmail(normalizedUsername),
        password,
      }),
      "Sign in",
    );
    if (signInError) throw signInError;
    if (signInData.user) await loadProfile(signInData.user.id);
  }

  async function signOut() {
    if (profile) {
      await supabase.from("profiles").update({ status: "offline" }).eq("id", profile.id);
    }
    await supabase.auth.signOut();
    setProfile(null);
  }

  return { profile, signIn, signUp, signOut, loading: false };
}

export function usePresence(
  userId: string | undefined,
  currentStatus: Profile["status"] | undefined,
) {
  useEffect(() => {
    if (!userId) return;

    const setOnline = () => {
      if (!currentStatus || currentStatus === "offline") {
        supabase.from("profiles").update({ status: "online" }).eq("id", userId);
      }
    };

    setOnline();
    const interval = setInterval(setOnline, 30000);

    const handleUnload = () => {
      supabase.from("profiles").update({ status: "offline" }).eq("id", userId);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, [userId, currentStatus]);
}
