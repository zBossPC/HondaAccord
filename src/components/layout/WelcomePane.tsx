import { MessageCircle, Plus, UserPlus, Users } from "lucide-react";
import { useAppStore } from "../../stores/appStore";

export function WelcomePane({ spaceName }: { spaceName?: string }) {
  const { openFriends, openHome } = useAppStore();

  if (spaceName) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[var(--color-bg-tertiary)] p-8 text-center">
        <h2 className="text-2xl font-bold">Welcome to {spaceName}</h2>
        <p className="mt-2 max-w-md text-[var(--color-text-muted)]">
          Pick a channel from the left to start chatting or join voice.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[var(--color-bg-tertiary)] p-8">
      <img src="/icon.png" alt="" className="app-logo mb-6" />
      <h2 className="text-2xl font-bold">Welcome to HondaAccord</h2>
      <p className="mt-2 mb-8 max-w-md text-center text-[var(--color-text-muted)]">
        Add friends, create a Space, and start chatting. Click a button below to get started.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={openFriends}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-5 py-3 font-medium text-white hover:bg-[var(--color-brand-hover)]"
        >
          <UserPlus size={18} />
          Add Friends
        </button>
        <button
          type="button"
          onClick={openHome}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-bg-elevated)] px-5 py-3 font-medium hover:bg-[var(--color-bg-hover)]"
        >
          <MessageCircle size={18} />
          Direct Messages
        </button>
      </div>
      <p className="mt-8 text-sm text-[var(--color-text-faint)]">
        Tip: Use the <Users size={14} className="inline" /> icon in the sidebar for Friends, or{" "}
        <Plus size={14} className="inline" /> to create a Space.
      </p>
    </div>
  );
}
