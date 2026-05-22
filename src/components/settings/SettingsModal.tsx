import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { checkForAppUpdate, getAppVersion, installAppUpdate, isDesktopApp } from "../../lib/updater";
import { useAuthStore } from "../../stores/authStore";
import type { UserStatus } from "../../types";
import { Modal } from "../ui/Modal";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { profile, setProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [status, setStatus] = useState<UserStatus>(
    profile?.status === "offline" ? "online" : profile?.status ?? "online",
  );
  const [statusMessage, setStatusMessage] = useState(profile?.status_message ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [installingUpdate, setInstallingUpdate] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<Awaited<
    ReturnType<typeof checkForAppUpdate>
  > | null>(null);

  const currentProfile = profile;
  if (!currentProfile) return null;
  const profileId = currentProfile.id;
  const username = currentProfile.username;

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const updates = {
      display_name: displayName.trim() || username,
      status,
      status_message: statusMessage.trim() || null,
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profileId)
      .select("*")
      .single();

    setSaving(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setProfile(data);
    setMessage("Saved.");
  }

  async function handleCheckUpdate() {
    setCheckingUpdate(true);
    setUpdateMessage("");
    setPendingUpdate(null);
    try {
      const result = await checkForAppUpdate();
      setPendingUpdate(result);
      if (!result.available) {
        setUpdateMessage(result.reason);
      } else {
        setUpdateMessage(`Update available: v${result.version}`);
      }
    } catch (err) {
      setUpdateMessage(err instanceof Error ? err.message : "Update check failed");
    } finally {
      setCheckingUpdate(false);
    }
  }

  async function handleInstallUpdate() {
    if (!pendingUpdate?.available) return;
    setInstallingUpdate(true);
    try {
      await installAppUpdate(pendingUpdate);
      setUpdateMessage("Download started — run the installer when it finishes.");
    } catch (err) {
      setUpdateMessage(err instanceof Error ? err.message : "Download failed");
    } finally {
      setInstallingUpdate(false);
    }
  }

  return (
    <Modal title="Settings" onClose={onClose}>
      <form onSubmit={saveProfile} className="space-y-5">
        <section>
          <h3 className="mb-3 text-sm font-semibold text-white">Profile</h3>
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
            Display name
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={32}
            className="mb-3 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          />
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="mb-3 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          >
            <option value="online">Online</option>
            <option value="idle">Idle</option>
            <option value="dnd">Do Not Disturb</option>
          </select>
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
            Custom status
          </label>
          <input
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            maxLength={80}
            placeholder="Cruising..."
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          />
        </section>

        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
          <h3 className="mb-1 text-sm font-semibold text-white">App Updates</h3>
          <p className="mb-3 text-sm text-[var(--color-text-muted)]">
            {isDesktopApp()
              ? `Running v${getAppVersion()}. Check GitHub for new builds and download the installer in one click.`
              : "Run the desktop app to check for updates."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCheckUpdate}
              disabled={!isDesktopApp() || checkingUpdate || installingUpdate}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
            >
              <RefreshCw size={16} className={checkingUpdate ? "animate-spin" : ""} />
              {checkingUpdate ? "Checking..." : "Check for Updates"}
            </button>
            {pendingUpdate?.available && (
              <button
                type="button"
                onClick={handleInstallUpdate}
                disabled={installingUpdate}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-hover)] disabled:opacity-50"
              >
                <Download size={16} />
                {installingUpdate ? "Opening..." : `Download v${pendingUpdate.version}`}
              </button>
            )}
          </div>
          {updateMessage && (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{updateMessage}</p>
          )}
        </section>

        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3">
          <h3 className="mb-1 text-sm font-semibold text-white">App window</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Closing the window now fully quits HondaAccord, which prevents old installed versions
            from staying open in the tray after an update.
          </p>
        </section>

        {message && <p className="text-sm text-[var(--color-text-muted)]">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[var(--color-brand)] py-2.5 font-medium text-white hover:bg-[var(--color-brand-hover)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </Modal>
  );
}
