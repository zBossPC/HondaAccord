import { Hash, Settings, Volume2 } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import { useVoiceStore } from "../../stores/voiceStore";
import type { Channel } from "../../types";

interface ChannelListProps {
  channels: Channel[];
  spaceName: string;
  isDm?: boolean;
  onOpenSpaceSettings?: () => void;
}

export function ChannelList({
  channels,
  spaceName,
  isDm,
  onOpenSpaceSettings,
}: ChannelListProps) {
  const { selectedChannel, selectChannel } = useAppStore();
  const { connected, channelId: voiceChannelId } = useVoiceStore();

  const textChannels = channels.filter((c) => c.type === "text");
  const voiceChannels = channels.filter((c) => c.type === "voice");

  return (
    <div className="flex min-h-0 w-60 shrink-0 flex-1 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="flex h-12 items-center gap-2 border-b border-[var(--color-border)] px-3 shadow-sm">
        <h2 className="min-w-0 flex-1 truncate font-semibold">{spaceName}</h2>
        {!isDm && onOpenSpaceSettings && (
          <button
            type="button"
            onClick={onOpenSpaceSettings}
            title="Space settings"
            className="rounded p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-white"
          >
            <Settings size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 pt-3">
        {!isDm && textChannels.length > 0 && (
          <>
            <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-faint)]">
              Text Channels
            </p>
            {textChannels.map((channel) => (
              <ChannelButton
                key={channel.id}
                channel={channel}
                selected={selectedChannel?.id === channel.id}
                onSelect={() => selectChannel(channel)}
                icon={<Hash size={18} className="shrink-0 opacity-60" />}
              />
            ))}
          </>
        )}

        {isDm &&
          textChannels.map((channel) => (
            <ChannelButton
              key={channel.id}
              channel={channel}
              selected={selectedChannel?.id === channel.id}
              onSelect={() => selectChannel(channel)}
              icon={<Hash size={18} className="shrink-0 opacity-60" />}
              label="Messages"
            />
          ))}

        {!isDm && voiceChannels.length > 0 && (
          <>
            <p className="mb-1 mt-4 px-2 text-[11px] font-bold uppercase tracking-wide text-[var(--color-text-faint)]">
              Voice Channels
            </p>
            {voiceChannels.map((channel) => (
              <ChannelButton
                key={channel.id}
                channel={channel}
                selected={selectedChannel?.id === channel.id}
                onSelect={() => selectChannel(channel)}
                icon={<Volume2 size={18} className="shrink-0 opacity-60" />}
                inVoice={connected && voiceChannelId === channel.id}
              />
            ))}
          </>
        )}

        {channels.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-[var(--color-text-muted)]">
            No channels yet
          </p>
        )}
      </div>
    </div>
  );
}

function ChannelButton({
  channel,
  selected,
  onSelect,
  icon,
  label,
  inVoice,
}: {
  channel: Channel;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label?: string;
  inVoice?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`mb-0.5 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[15px] transition-colors ${
        selected
          ? "bg-[var(--color-bg-accent)] text-white"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
      }`}
    >
      {icon}
      <span className="truncate flex-1">{label ?? channel.name}</span>
      {inVoice && <span className="voice-channel-dot" title="Connected" />}
    </button>
  );
}
