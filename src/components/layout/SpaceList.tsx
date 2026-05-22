import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import { useSpaces } from "../../hooks/useSpaces";
import { Modal } from "../ui/Modal";
import type { Space } from "../../types";

export function SpaceList() {
  const { spaces, createSpace, getSpaceWithChannels } = useSpaces();
  const { viewMode, selectedSpace, openHome, openFriends, selectSpace, selectChannel } =
    useAppStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const spaceId = await createSpace(newName.trim());
      const { space, channels } = await getSpaceWithChannels(spaceId);
      selectSpace(space);
      const general = channels.find((c) => c.type === "text") ?? channels[0];
      if (general) selectChannel(general);
      setNewName("");
      setShowCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create space");
    } finally {
      setCreating(false);
    }
  }

  async function handleSelectSpace(space: Space) {
    selectSpace(space);
    const { channels } = await getSpaceWithChannels(space.id);
    const first = channels.find((c) => c.type === "text") ?? channels[0];
    if (first) selectChannel(first);
  }

  return (
    <>
      <div className="flex w-[72px] shrink-0 flex-col items-center gap-2 overflow-y-auto bg-[var(--color-bg-primary)] py-3">
        <button
          type="button"
          onClick={openHome}
          title="Direct Messages"
          className={`group relative flex h-12 w-12 items-center justify-center rounded-[24px] transition-all duration-200 hover:rounded-[16px] ${
            viewMode === "home"
              ? "rounded-[16px] bg-[var(--color-brand)] text-white"
              : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-brand)] hover:text-white"
          }`}
        >
          <img src="icon.png" alt="Home" className="app-logo-sm" />
        </button>

        <button
          type="button"
          onClick={openFriends}
          title="Friends"
          className={`flex h-12 w-12 items-center justify-center rounded-[24px] transition-all duration-200 hover:rounded-[16px] ${
            viewMode === "friends"
              ? "rounded-[16px] bg-[var(--color-brand)] text-white"
              : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] hover:bg-[var(--color-brand)] hover:text-white"
          }`}
        >
          <Users size={22} />
        </button>

        <div className="my-1 h-0.5 w-8 rounded-full bg-[var(--color-border-strong)]" />

        {spaces.map((space) => (
          <button
            key={space.id}
            type="button"
            title={space.name}
            onClick={() => handleSelectSpace(space)}
            className={`flex h-12 w-12 items-center justify-center rounded-[24px] text-sm font-bold transition-all duration-200 hover:rounded-[16px] ${
              viewMode === "space" && selectedSpace?.id === space.id
                ? "rounded-[16px] bg-[var(--color-brand)] text-white"
                : "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand)] hover:text-white"
            }`}
          >
            {space.name.slice(0, 2).toUpperCase()}
          </button>
        ))}

        <button
          type="button"
          title="Create Space"
          onClick={() => setShowCreate(true)}
          className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-[var(--color-bg-elevated)] text-[var(--color-online)] transition-all duration-200 hover:rounded-[16px] hover:bg-[var(--color-online)] hover:text-white"
        >
          <Plus size={22} />
        </button>
      </div>

      {showCreate && (
        <Modal title="Create a Space" onClose={() => setShowCreate(false)}>
          <p className="mb-4 text-sm text-[var(--color-text-muted)]">
            Spaces are private groups for you and your friends — like a mini server without the server list.
          </p>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                Space name
              </label>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Crew"
                maxLength={32}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 outline-none focus:border-[var(--color-brand)]"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="w-full rounded-lg bg-[var(--color-brand)] py-2.5 font-medium hover:bg-[var(--color-brand-hover)] disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Space"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
