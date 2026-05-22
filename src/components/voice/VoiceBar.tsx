import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Signal,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useVoiceStore } from "../../stores/voiceStore";
import { useAppStore } from "../../stores/appStore";

export function VoiceBar() {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const {
    connected,
    channelId,
    channelName,
    spaceName,
    spaceId,
    muted,
    deafened,
    screenSharing,
    screenShareQuality,
    setScreenShareQuality,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
    leave,
  } = useVoiceStore();
  const { selectedChannel } = useAppStore();

  if (!connected) return null;

  const viewingVoice = selectedChannel?.type === "voice" && selectedChannel.id === channelId;

  async function handleScreenShare() {
    if (screenSharing) {
      await toggleScreenShare();
      return;
    }
    setShowShareDialog(true);
  }

  async function startScreenShare() {
    setShowShareDialog(false);
    await toggleScreenShare();
  }

  return (
    <>
      <div className="voice-bar">
        <div className="voice-bar-info">
          <Signal size={16} className="voice-bar-signal" />
          <div className="min-w-0">
            <p className="voice-bar-title">Voice Connected</p>
            <p className="voice-bar-sub truncate">
              {spaceName ? `${spaceName} / ` : ""}
              {channelName}
            </p>
          </div>
        </div>

        <div className="voice-bar-controls">
          <NativeVoiceControl active={muted} danger={muted} label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {muted ? <MicOff size={18} /> : <Mic size={18} />}
          </NativeVoiceControl>
          <NativeVoiceControl active={deafened} danger={deafened} label={deafened ? "Undeafen" : "Deafen"} onClick={toggleDeafen}>
            {deafened ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </NativeVoiceControl>
          <NativeVoiceControl active={screenSharing} accent={screenSharing} label={screenSharing ? "Stop sharing" : "Share screen"} onClick={handleScreenShare}>
            <MonitorUp size={18} />
          </NativeVoiceControl>
          <NativeVoiceControl danger label="Disconnect" onClick={leave}>
            <PhoneOff size={18} />
          </NativeVoiceControl>
        </div>

        {!viewingVoice && channelId && spaceId && (
          <GoToVoiceButton channelId={channelId} spaceId={spaceId} />
        )}
      </div>

      {showShareDialog && (
        <ScreenShareDialog
          quality={screenShareQuality}
          setQuality={setScreenShareQuality}
          onCancel={() => setShowShareDialog(false)}
          onStart={startScreenShare}
        />
      )}
    </>
  );
}

function GoToVoiceButton({ channelId, spaceId }: { channelId: string; spaceId: string }) {
  const { selectSpace, selectChannel } = useAppStore();

  async function goToVoice() {
    const { supabase } = await import("../../lib/supabase");
    const [{ data: space }, { data: channel }] = await Promise.all([
      supabase.from("spaces").select("*").eq("id", spaceId).single(),
      supabase.from("channels").select("*").eq("id", channelId).single(),
    ]);
    if (space) selectSpace(space);
    if (channel) selectChannel(channel);
  }

  return (
    <button type="button" onClick={goToVoice} className="voice-bar-open">
      Open Voice
    </button>
  );
}

function ScreenShareDialog({
  quality,
  setQuality,
  onCancel,
  onStart,
}: {
  quality: "standard" | "high" | "ultra";
  setQuality: (q: "standard" | "high" | "ultra") => void;
  onCancel: () => void;
  onStart: () => void;
}) {
  return (
    <div className="screen-share-overlay">
      <div className="screen-share-dialog animate-fade-in">
        <div className="screen-share-icon">
          <MonitorUp size={28} />
        </div>
        <h2>Share your screen</h2>
        <p>
          Choose a quality preset, then pick the window or screen from the system selector.
          HondaAccord will start sharing after you confirm.
        </p>

        <div className="screen-share-quality">
          {[
            ["standard", "1080p", "Best for slower connections"],
            ["high", "1440p 60", "Recommended"],
            ["ultra", "4K 60", "High bandwidth"],
          ].map(([value, label, desc]) => (
            <button
              key={value}
              type="button"
              onClick={() => setQuality(value as "standard" | "high" | "ultra")}
              className={`screen-share-quality-btn ${quality === value ? "active" : ""}`}
            >
              <span>{label}</span>
              <small>{desc}</small>
            </button>
          ))}
        </div>

        <div className="screen-share-actions">
          <button type="button" className="screen-share-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="screen-share-start" onClick={onStart}>
            Choose Screen
          </button>
        </div>
      </div>
    </div>
  );
}

function NativeVoiceControl({
  children,
  onClick,
  label,
  active,
  danger,
  accent,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
  danger?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`native-voice-btn ${danger && active ? "native-voice-btn-danger" : ""} ${accent && active ? "native-voice-btn-accent" : ""}`}
    >
      {children}
    </button>
  );
}

export function VideoStage({
  track,
  name,
  isLocal,
}: {
  track: MediaStreamTrack;
  name: string;
  isLocal?: boolean;
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
    <div className="video-stage">
      <div className="video-stage-chrome">
        <span className="video-stage-dot" />
        <span className="video-stage-dot" />
        <span className="video-stage-dot" />
        <span className="video-stage-label">
          {isLocal ? "Your Screen" : `${name}'s Screen`}
        </span>
      </div>
      <video ref={ref} autoPlay playsInline className="video-stage-video" />
    </div>
  );
}
