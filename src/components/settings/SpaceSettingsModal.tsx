import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useSpaces } from "../../hooks/useSpaces";
import { useAppStore } from "../../stores/appStore";
import { useVoiceStore } from "../../stores/voiceStore";
import { Modal } from "../ui/Modal";

interface SpaceSettingsModalProps {
  spaceId: string;
  spaceName: string;
  isOwner: boolean;
  onClose: () => void;
}

export function SpaceSettingsModal({
  spaceId,
  spaceName,
  isOwner,
  onClose,
}: SpaceSettingsModalProps) {
  const { deleteSpace, leaveSpace } = useSpaces();
  const { selectedSpace, openHome } = useAppStore();
  const { connected, spaceId: voiceSpaceId, leave: leaveVoice } = useVoiceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");

  async function handleDelete() {
    if (confirmText !== spaceName) {
      setError(`Type "${spaceName}" to confirm deletion.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (connected && voiceSpaceId === spaceId) {
        await leaveVoice();
      }
      await deleteSpace(spaceId);
      if (selectedSpace?.id === spaceId) {
        openHome();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete space");
    } finally {
      setLoading(false);
    }
  }

  async function handleLeave() {
    setLoading(true);
    setError("");
    try {
      if (connected && voiceSpaceId === spaceId) {
        await leaveVoice();
      }
      await leaveSpace(spaceId);
      if (selectedSpace?.id === spaceId) {
        openHome();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave space");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Space Settings" onClose={onClose}>
      <div className="space-y-5">
        <section>
          <h3 className="mb-1 text-sm font-semibold text-white">{spaceName}</h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            {isOwner
              ? "You own this space. Deleting it removes all channels and messages permanently."
              : "Leave this space to remove it from your sidebar. You can be re-invited later."}
          </p>
        </section>

        {isOwner ? (
          <section className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-red-400">
              <AlertTriangle size={18} />
              <h4 className="font-semibold">Delete Space</h4>
            </div>
            <p className="mb-3 text-sm text-[var(--color-text-muted)]">
              Type <strong className="text-white">{spaceName}</strong> to confirm.
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={spaceName}
              className="mb-3 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || confirmText !== spaceName}
              className="w-full rounded-lg bg-red-600 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Space Forever"}
            </button>
          </section>
        ) : (
          <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
            <h4 className="mb-2 font-semibold text-white">Leave Space</h4>
            <p className="mb-3 text-sm text-[var(--color-text-muted)]">
              You will lose access to all channels in this space.
            </p>
            <button
              type="button"
              onClick={handleLeave}
              disabled={loading}
              className="w-full rounded-lg border border-[var(--color-border)] py-2.5 font-medium hover:bg-[var(--color-bg-hover)] disabled:opacity-50"
            >
              {loading ? "Leaving..." : "Leave Space"}
            </button>
          </section>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </Modal>
  );
}
