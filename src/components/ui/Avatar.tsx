import { clsx } from "clsx";
import type { UserStatus } from "../../types";

export function StatusDot({ status, className }: { status: UserStatus; className?: string }) {
  const colors: Record<UserStatus, string> = {
    online: "bg-[var(--color-online)]",
    idle: "bg-[var(--color-idle)]",
    dnd: "bg-[var(--color-dnd)]",
    offline: "bg-gray-500",
  };

  return (
    <span
      className={clsx(
        "inline-block h-3 w-3 rounded-full border-[3px] border-[var(--color-bg-elevated)]",
        colors[status],
        className,
      )}
    />
  );
}

export function Avatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const initial = (name[0] ?? "?").toUpperCase();
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-2xl",
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={clsx("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[#990000] font-bold text-white shadow-inner",
        sizes[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
