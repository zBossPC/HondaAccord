import { MessageCircle } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import { useSpaces } from "../../hooks/useSpaces";
import { Avatar } from "../ui/Avatar";
import type { Space } from "../../types";

export function DmList() {
  const { dmSpaces, getSpaceWithChannels } = useSpaces();
  const { selectedSpace, selectSpace, selectChannel } = useAppStore();

  async function openDm(space: Space) {
    selectSpace(space);
    const { channels } = await getSpaceWithChannels(space.id);
    const text = channels.find((c) => c.type === "text") ?? channels[0];
    if (text) selectChannel(text);
  }

  return (
    <div className="flex min-h-0 w-60 shrink-0 flex-1 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="flex h-12 items-center border-b border-[var(--color-border)] px-4">
        <h2 className="font-semibold">Direct Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {dmSpaces.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <MessageCircle size={32} className="mx-auto mb-2 text-[var(--color-text-faint)]" />
            <p className="text-sm text-[var(--color-text-muted)]">
              No conversations yet. Message a friend from the Friends tab.
            </p>
          </div>
        ) : (
          dmSpaces.map((dm) => (
            <button
              key={dm.id}
              type="button"
              onClick={() => openDm(dm)}
              className={`mb-0.5 flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                selectedSpace?.id === dm.id
                  ? "bg-[var(--color-bg-accent)]"
                  : "hover:bg-[var(--color-bg-hover)]"
              }`}
            >
              <Avatar name={dm.name} size="sm" />
              <span className="truncate text-sm font-medium">{dm.name}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
