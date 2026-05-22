import { useEffect } from "react";
import { MicOff, Users, Volume2 } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useVoiceStore } from "../../stores/voiceStore";
import { Avatar } from "../ui/Avatar";
import { VideoStage } from "./VoiceBar";

interface VoicePanelProps {
  channelId: string;
  channelName: string;
  spaceName?: string;
  spaceId?: string;
}

export function VoicePanel({ channelId, channelName, spaceName, spaceId }: VoicePanelProps) {
  const { profile } = useAuthStore();
  const {
    connected,
    connecting,
    channelId: activeChannelId,
    liveParticipants,
    voicePresence,
    error,
    join,
    subscribePresence,
    refreshPresence,
  } = useVoiceStore();

  const isThisChannel = connected && activeChannelId === channelId;
  const isOtherChannel = connected && activeChannelId !== channelId;

  useEffect(() => {
    if (!isThisChannel && !connected) {
      const unsub = subscribePresence(channelId);
      return unsub;
    }
    if (isThisChannel) {
      void refreshPresence();
    }
  }, [channelId, isThisChannel, connected, subscribePresence, refreshPresence]);

  const screenShares = isThisChannel
    ? liveParticipants.filter((p) => p.videoTrack)
    : [];

  const participants = isThisChannel
    ? liveParticipants.length > 0
      ? liveParticipants
      : voicePresence.map((vp) => ({
          identity: vp.user_id,
          name: vp.profile?.display_name ?? vp.profile?.username ?? "User",
          isSpeaking: false,
          isMuted: vp.is_muted,
          videoTrack: null as MediaStreamTrack | null | undefined,
        }))
    : voicePresence.map((vp) => ({
        identity: vp.user_id,
        name: vp.profile?.display_name ?? vp.profile?.username ?? "User",
        isSpeaking: false,
        isMuted: vp.is_muted,
        videoTrack: null as MediaStreamTrack | null | undefined,
      }));

  async function handleJoin() {
    if (!profile) return;
    await join(
      channelId,
      channelName,
      spaceName ?? "",
      spaceId ?? "",
      profile.id,
      profile.display_name ?? profile.username,
    );
  }

  return (
    <div className="voice-panel">
      <header className="voice-panel-header">
        <Volume2 size={18} className="text-[var(--color-text-muted)]" />
        <h2 className="font-semibold">{channelName}</h2>
        {isThisChannel && (
          <span className="voice-connected-badge">
            <span className="voice-connected-dot" />
            Live
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <Users size={14} />
          {participants.length || voicePresence.length}
        </span>
      </header>

      <div className="voice-panel-body">
        {!isThisChannel ? (
          <div className="voice-join-card">
            <div className="voice-join-icon">
              <Volume2 size={36} />
            </div>
            <h3 className="text-xl font-bold">{channelName}</h3>
            <p className="mt-2 max-w-sm text-center text-[var(--color-text-muted)]">
              {isOtherChannel
                ? "You're in another voice channel. Join here to switch."
                : "Join voice to talk with everyone in this channel."}
            </p>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <button
              type="button"
              onClick={handleJoin}
              disabled={connecting}
              className="voice-join-btn"
            >
              {connecting ? "Connecting..." : isOtherChannel ? "Switch to This Channel" : "Join Voice"}
            </button>
          </div>
        ) : (
          <>
            {screenShares.length > 0 && (
              <div className="voice-stage-grid">
                {screenShares.map((p) =>
                  p.videoTrack ? (
                    <VideoStage
                      key={p.identity}
                      track={p.videoTrack}
                      name={p.name}
                      isLocal={p.identity === profile?.id}
                    />
                  ) : null,
                )}
              </div>
            )}

            <div className="voice-participant-grid">
              {participants.map((p) => (
                <div
                  key={p.identity}
                  className={`voice-participant-tile ${p.isSpeaking ? "voice-participant-speaking" : ""}`}
                >
                  <Avatar name={p.name} size="lg" />
                  <span className="voice-participant-name">{p.name}</span>
                  {p.isMuted && <MicOff size={14} className="text-red-400" />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
