import { LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Avatar, StatusDot } from "./Avatar";

interface UserPanelProps {
  onSignOut: () => void;
  onOpenSettings: () => void;
}

export function UserPanel({ onSignOut, onOpenSettings }: UserPanelProps) {
  const { profile } = useAuthStore();
  if (!profile) return null;

  const name = profile.display_name ?? profile.username;

  return (
    <div className="flex items-center gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 py-2">
      <div className="relative shrink-0">
        <Avatar name={name} avatarUrl={profile.avatar_url} size="sm" />
        <span className="absolute -bottom-0.5 -right-0.5">
          <StatusDot status={profile.status} />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{name}</p>
        <p className="truncate text-xs text-[var(--color-text-muted)]">@{profile.username}</p>
        <p className="truncate text-[10px] text-[var(--color-text-faint)]">
          v{import.meta.env.VITE_APP_VERSION ?? "0.2.1"}
        </p>
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        title="Settings"
        className="rounded p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-white"
      >
        <Settings size={16} />
      </button>
      <button
        type="button"
        onClick={onSignOut}
        title="Log out"
        className="rounded p-1.5 text-[var(--color-text-muted)] hover:bg-red-500/20 hover:text-red-400"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
