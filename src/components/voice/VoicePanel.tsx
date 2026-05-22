import { useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Volume2,
  VolumeX,
  Wifi,
} from "lucide-react";
import { useVoice } from "../../hooks/useVoice";
import { Avatar } from "../ui/Avatar";

interface VoicePanelProps {
  channelId: string;
  channelName: string;
}

function VideoTile({
  track,
  name,
  isSpeaking,
}: {
  track: MediaStreamTrack;
  name: string;
  isSpeaking: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stream = new MediaStream([track]);
    el.srcObject = stream;
    el.play().catch(() => {});
    return () => {
      el.srcObject = null;
    };
  }, [track]);

  return (
    <div className={`relative overflow-hidden rounded-xl bg-black ${isSpeaking ? "ring-2 ring-[var(--color-online)]" : "ring-1 ring-[var(--color-border)]"}`}>
      <video ref={ref} autoPlay playsInline className="aspect-video w-full object-contain" />
      <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium">
        {name}
      </div>
    </div>
  );
}

export function VoicePanel({ channelId, channelName }: VoicePanelProps) {
  const {
    connected,
    connecting,
    muted,
    deafened,
    screenSharing,
    screenShareQuality,
    setScreenShareQuality,
    liveParticipants,
    voicePresence,
    error,
    join,
    leave,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
  } = useVoice(channelId);

  const screenShares = liveParticipants.filter((p) => p.videoTrack);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[var(--color-bg-tertiary)]">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-4">
        <Volume2 size={20} className="text-[var(--color-text-muted)]" />
        <span className="font-semibold">{channelName}</span>
        {connected && (
          <span className="ml-auto flex items-center gap-1 text-xs text-[var(--color-online)]">
            <Wifi size={14} /> Connected
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        {!connected ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
              <Volume2 size={40} className="text-[var(--color-text-muted)]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{channelName}</h3>
              <p className="mt-1 text-[var(--color-text-muted)]">
                Join voice to talk with friends in this channel
              </p>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="button"
              onClick={join}
              disabled={connecting}
              className="rounded-lg bg-[var(--color-brand)] px-8 py-2.5 font-semibold hover:bg-[var(--color-brand-hover)] disabled:opacity-50"
            >
              {connecting ? "Connecting..." : "Join Voice"}
            </button>
          </div>
        ) : (
          <>
            {screenShares.length > 0 && (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {screenShares.map((p) =>
                  p.videoTrack ? (
                    <VideoTile
                      key={p.identity}
                      track={p.videoTrack}
                      name={`${p.name}'s screen`}
                      isSpeaking={p.isSpeaking}
                    />
                  ) : null,
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {(liveParticipants.length > 0 ? liveParticipants : voicePresence.map((vp) => ({
                identity: vp.user_id,
                name: vp.profile?.display_name ?? vp.profile?.username ?? "User",
                isSpeaking: false,
                isMuted: vp.is_muted,
              }))).map((p) => (
                <div
                  key={p.identity}
                  className={`flex flex-col items-center gap-2 rounded-xl bg-[var(--color-bg-elevated)] p-4 transition ${
                    p.isSpeaking ? "speaking-ring ring-2 ring-[var(--color-online)]" : ""
                  }`}
                >
                  <Avatar name={p.name} size="lg" />
                  <span className="max-w-full truncate text-sm font-medium">{p.name}</span>
                  {p.isMuted && <MicOff size={14} className="text-red-400" />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {connected && (
        <div className="flex shrink-0 items-center justify-center gap-2 border-t border-[var(--color-border)] py-4">
          <select
            value={screenShareQuality}
            onChange={(e) =>
              setScreenShareQuality(e.target.value as "standard" | "high" | "ultra")
            }
            disabled={screenSharing}
            title="Screen share quality"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="standard">1080p 30</option>
            <option value="high">1440p 60</option>
            <option value="ultra">4K 60</option>
          </select>
          <VoiceButton active={muted} danger={muted} onClick={toggleMute} title={muted ? "Unmute" : "Mute"}>
            {muted ? <MicOff size={20} /> : <Mic size={20} />}
          </VoiceButton>
          <VoiceButton active={deafened} danger={deafened} onClick={toggleDeafen} title={deafened ? "Undeafen" : "Deafen"}>
            {deafened ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </VoiceButton>
          <VoiceButton active={screenSharing} success={screenSharing} onClick={toggleScreenShare} title="Share screen">
            <MonitorUp size={20} />
          </VoiceButton>
          <VoiceButton danger onClick={leave} title="Disconnect">
            <PhoneOff size={20} />
          </VoiceButton>
        </div>
      )}
    </div>
  );
}

function VoiceButton({
  children,
  onClick,
  title,
  active,
  danger,
  success,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  danger?: boolean;
  success?: boolean;
}) {
  let cls = "bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)]";
  if (danger && active) cls = "bg-red-600 hover:bg-red-700";
  if (success && active) cls = "bg-green-600 hover:bg-green-700";

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-full p-3.5 transition-colors ${cls}`}
    >
      {children}
    </button>
  );
}
