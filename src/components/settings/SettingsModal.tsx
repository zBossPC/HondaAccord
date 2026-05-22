import { useState } from "react";
import { supabase } from "../../lib/supabase";
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
  const [statusMessage, setStatusMessage] = useState(
    profile?.status_message ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
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

  return (
    <Modal title="Settings" onClose={onClose}>
      <form onSubmit={saveProfile} className="space-y-4">
        <section>
          <h3 className="mb-3 text-sm font-semibold text-white">Profile</h3>
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
            Display name
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={32}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          />
        </section>

        <section>
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          >
            <option value="online">Online</option>
            <option value="idle">Idle</option>
            <option value="dnd">Do Not Disturb</option>
          </select>
        </section>

        <section>
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

        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3">
          <h3 className="mb-1 text-sm font-semibold text-white">Background mode</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            Closing the window now hides HondaAccord to the system tray. Use the
            tray icon to restore it or quit completely.
          </p>
        </section>

        {message && (
          <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
        )}

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
